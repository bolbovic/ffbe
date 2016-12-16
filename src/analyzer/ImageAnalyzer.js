import React from 'react';
import { orderBy } from 'lodash';

require('tracking');
const Tracking = window.tracking;

let podium = require('../../img/podium3.png');
let cPodium = document.createElement('canvas');
let img = new Image();
img.onload = (evt) => {
  let canvas = cPodium;
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
}
img.src = podium;

class MyTracker extends Tracking.Tracker {
  constructor(images) {
    super();
  }

  getSummary(p, tW, x, y, w, h, precision = 50) {
    let colors = {}, pix = new Uint8ClampedArray(w * h * 4);
    for( let i = 0; i < w * h * 4; i += 4){
      let idx = ((y + Math.floor( (i/4) / w)) * tW + x + ((i/4) % w))*4;
      if ( p[idx+3] > 0 ) {
        // Colors are transformed on 3 bytes instead of 6 bytes
        let color = ( (Math.floor(p[idx]/16) << 8) + (Math.floor(p[idx+1]/16) << 4) + Math.floor(p[idx+2]/16) ).toString(16);
        if ( colors[color] ) {
          colors[color].times++;
        } else {
          colors[color] = {times: 1, color};
        }
      }
      pix[idx] = p[idx];
      pix[idx+1] = p[idx+1];
      pix[idx+2] = p[idx+2];
      pix[idx+3] = p[idx+3];
    }
    return {
      colors: colors,
      colorSum: orderBy(colors, ['times'], ['desc'])
        .filter( (o) => { return o.times > precision}),
      height: h,
      pixels: pix,
      total: w * h,
      width: w
    };
  }

  compareSummaries(a, b) {
    if ( a.colorSum.length > b.colorSum.length ) {
      return this.compareSummaries(b, a);
    } else {
      let score = 0, total = 0, ta = a.total, tb = b.total;
      for ( let i = 0; i < a.colorSum.length; i++ ) {
        let col = a.colorSum[i].color, fa = a.colors[col].times;
        if ( b.colors[col] ) {
          let ra = fa / ta, rb = b.colors[col].times / tb, fb = fa * rb / ra;
          score += Math.max(fa - Math.abs(fa - fb), 0);
        }
        total += fa;
      }
      return score / total;
    }
  }

  getColor(idx) {
    return `#${Math.floor(16 * idx).toString(16)}${Math.floor(16 * idx).toString(16)}${Math.floor(16 * idx).toString(16)}`;
  }

  track(pixels, width, height) {
    const startTime = new Date().getTime(), data = [];

    let podPixels = cPodium.getContext('2d').getImageData(0, 0, img.width, img.height).data;
    let podSum = this.getSummary(podPixels, img.width, 0, 0, img.width, img.height, 100);
    console.log( podSum );
    console.log(`Process time: ${new Date().getTime() - startTime}`);

    //Algo
    // start is pod.width / 4,  pod.height/4
    let ign = new Uint8ClampedArray(width * height), h = img.height, w = img.width;
    console.log(width, height);
    for ( let y = 0; y < height - h; y++) {
      for ( let x = 0; x < width - w; x++ ) {
        // calculate the object
        if ( ign[y * width + x] === 0 ) {
          let sum = this.getSummary(pixels, width, x, y, w, h);
          // if the object doesn't have any of the colors from the top 10...
          let idx = this.compareSummaries(podSum, sum);

          if (idx === 0) {
            // ignore the complete part scanned
            for ( let i = 0; i < h * w; i++ ) {
              ign[(y + Math.floor(i / w)) * width + x + (i % w)] = 1;
            }
          } else if ( idx < .05 ) {
            for ( let i = 0; i < h * w / 4; i++ ) {
              ign[(y + Math.floor(i / (w / 2))) * width + x + (i % (w/2))] = 1;
            }
          } else if ( idx > .40 ) {
            data.push({color: this.getColor(idx), x, y, height: h, width: w});
          }
          console.log(x, y, idx);
        }
      }
    }
    // for on the size of the sample
      // for on the pixels x
        // for on the pixels y
          // for on around the pixels
          // endfor
          // compare and save is potentially good
        //endfor
      //endfor
    //endfor
      
    console.log(`Process time: ${new Date().getTime() - startTime}`)
    this.emit('track', {
      //data: [{color:'magenta', x: 0, y: 0, height: 50, width: 50}]
      data
    });
  }
}


const DEFAULT_WIDTH = 1080;
const DEFAULT_HEIGHT = 1920;
const WHITE_VALUE = 220;

type Props = {
  onResolve: Function,
  src: string
}

class ImageAnalyzer extends React.Component {

  description: 'Component to extends to see a part of the image.'

  props: Props

  constructor(props: Props) {
    super(props);
    this.state = {
      /*canvas: 'nop'*/
    };
    this.me = `lloooolll${new Date().getUTCMilliseconds()}`;
    this.imgId = `img${new Date().getUTCMilliseconds()}`;
  }

  getContextFromScreenZone( s, img, showCanvas = false ) {
    let canvas = document.createElement('canvas');
    let coefX = this.coefX, coefY = this.coefY;
    canvas.width = s.width;
    canvas.height = s.height;
    let context = canvas.getContext('2d');
    context.drawImage(img,
      s.x * coefX, s.y * coefY,
      s.width * coefX, s.height * coefY,
      0, 0,
      s.width, s.height
    );
    if ( showCanvas ) {
      document.getElementById(this.me).appendChild(canvas);
    }
    return context;
  }

  isBlue(data, i) {
    return (data[i+2] < 210);
  }

  isWhite(data, i) {
    return (data[i] > WHITE_VALUE && data[i+1] > WHITE_VALUE && data[i+2] > WHITE_VALUE );
  }

  handleLoad = (evt) => {
    let that = this;
    let img = evt.target;
    this.coefX = img.width / DEFAULT_WIDTH;
    this.coefY = img.height / DEFAULT_HEIGHT;

    // Units
    /*let context = this.getContextFromScreenZone({
      x: 0, y:650, width: DEFAULT_WIDTH, height: 300
    }, img, true);*/

    /*let colors = new Tracking.ColorTracker(['magenta', 'blue', 'yellow']);
    colors.on('track', evt => {
      console.log('tracked');
      console.log(evt.data);
      evt.data.forEach(function(rect) {
        that.plot(rect.x, rect.y, rect.width, rect.height, rect.color);
      });
    });*/
    let tracker = new MyTracker();
    tracker.on('track', evt => {
      evt.data.forEach(function(rect) {
        that.plot(rect.x, rect.y, rect.width, rect.height, rect.color);
      });
    });
//    Tracking.track(`#${this.imgId}`, colors);
    Tracking.track(`#${this.imgId}`, tracker );

    this.props.onResolve && this.props.onResolve('nop');
  }

  plot(x, y, w, h, color) {
    let img = document.getElementById(this.imgId);
    let rect = document.createElement('div');
    document.querySelector('.image-analyzer').appendChild(rect);
    rect.classList.add('rect');
    rect.style.border = '2px solid ' + color;
    rect.style.width = w + 'px';
    rect.style.height = h + 'px';
    rect.style.left = (img.offsetLeft + x) + 'px';
    rect.style.top = (img.offsetTop + y) + 'px';
  };
  
  /* End Component Custom Methods */

  /* React Component LifeCycle Methods */
  //componentWillMount() {}
  componentDidMount() {
    this.img = new Image();
    this.img.onload = this.handleLoad;
    this.img.src = this.props.src;
  }
  //componentWillReceiveProps(nextProps) {}
  //shouldComponentUpdate(nextProps, nextState) {}
  //componentWillUpdate(nextProps, nextState) {}
  //componentDidUpdate(prevProps, prevState) {}
  //componentWillUnmount() {}
  render() {
    return (
      <div className="image-analyzer" id={this.me}>
        <img alt="nope" id={ this.imgId } src={this.props.src} />
      </div>
    );
  }
  /* End React Component LifeCycle Methods */
}

export default ImageAnalyzer;

//Unit test entry point
export const _ImageAnalyzer = ImageAnalyzer;