import React from 'react';
import { orderBy } from 'lodash';

require('tracking');
const Tracking = window.tracking;

const POD_BASE_WIDTH = 1440;
//const POD_BASE_HEIGHT = 2560;

let podium3Base = require('../../img/podium3.png');
let podium4Base = require('../../img/podium4.png');
let podium5Base = require('../../img/podium5.png');

class TrackPodiums extends Tracking.Tracker {
  constructor(pods, img) {
    super();
    this.pods = pods;
    this.img = img;
  }

  getSummary(p, tW, x, y, w, h, precision = 100) {
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
    return `#${Math.floor(15 * idx).toString(16)}${Math.floor(15 * idx).toString(16)}${Math.floor(15 * idx).toString(16)}`;
  }

  track(pixels, width, height) {
    const startTime = new Date().getTime(), data = [];
    let cv = this.pods[0], ratio = width / POD_BASE_WIDTH;

    if ( ratio !== 1 ) {
      let newCV = document.createElement('canvas');
      newCV.width =  cv.width * ratio;
      newCV.height = cv.height * ratio;
      newCV.getContext('2d').drawImage(cv,
        0, 0,
        cv.width, cv.height,
        0, 0,
        newCV.width, newCV.height
      );
      cv = newCV;
      this.img.appendChild(cv);
    }
    console.log(cv.width, cv.height);
    let podPixels = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
    let podSum = this.getSummary(podPixels, cv.width, 0, 0, cv.width, cv.height, 100 * ratio * ratio);
    console.log( podSum, width, height );
    console.log(`Process time: ${new Date().getTime() - startTime}`);

    //Algo
    // start is pod.width / 4,  pod.height/4
    let ign = new Uint8ClampedArray(width * height), h = cv.height, w = cv.width, lastIdx = 0;
    console.log(width, height);
    for ( let y = 0; y < height - h; y++) {
      for ( let x = 0; x < width - w; x++ ) {
        // calculate the object
        if ( ign[y * width + x] === 0 ) {
          let sum = this.getSummary(pixels, width, x, y, w, h);

          // if the object doesn't have any of the colors...
          let idx = this.compareSummaries(podSum, sum);
          if (idx === 0) {
            // ignore the complete part scanned
            for ( let i = 0; i < h * w; i++ ) {
              ign[(y + Math.floor(i / w)) * width + x + (i % w)] = 1;
            }
          } else if ( idx < .10 ) {
            for ( let i = 0; i < h * w / 4; i++ ) {
              ign[(y + Math.floor(i / (w / 2))) * width + x + (i % (w/2))] = 1;
            }
          } else if ( idx > .50 ) {
            data.push({color: this.getColor(idx), x, y, height: h, width: w, idx});
            //console.log(x, y, idx);
          /*} else if ( idx < lastIdx ) {
            for ( let i = 0; i < w / 2; i++ ) {
              ign[y * width + x + i] = 1;
            }*/
          }
          lastIdx = idx;
        }
      }
    }
    console.log(`Process time: ${new Date().getTime() - startTime}`);

    let realData = [];
    data.forEach( d => {
      let found = false;
      realData.forEach( (r, k) => {
        if ( !found && Math.abs(r.x - d.x) < w && Math.abs(r.y - d.y) < h ) {
          found = true;
          if ( r.idx < d.idx) {
            realData[k] = d;
          }
        }
      });
      if ( ! found ) {
        realData.push(d);
      }
    });

    /*realData = orderBy(data, ['idx'], ['desc'])
      .filter( (o) => { return o.idx > .90});*/

    // for on the size of the sample
      // for on the pixels x
        // for on the pixels y
          // for on around the pixels
          // endfor
          // compare and save is potentially good
        //endfor
      //endfor
    //endfor
    console.log(data);
    console.log(realData);
    console.log(`Process time: ${new Date().getTime() - startTime}`)
    this.emit('track', {
      //data: [{color:'magenta', x: 0, y: 0, height: 50, width: 50}]
      //data: realData
      data
    });
  }
}

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
    this.podiumsToLoad = [
      podium3Base,
      podium4Base,
      podium5Base
    ];
    this.pods = [];
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

  handleSrcLoad = (evt) => {
    let that = this;
    let img = evt.target;
    // Units
    let tracker = new TrackPodiums(this.pods, document.getElementById(this.me));
    tracker.on('track', evt => {
      evt.data.forEach(function(rect) {
        that.plot(rect.x, rect.y, rect.width, rect.height, rect.color);
      });
    });
    Tracking.track(img, tracker );
    this.props.onResolve && this.props.onResolve('nop');
  }

  handlePodiumLoad = (evt) => {
    let img = evt.target;
    let canvas = document.createElement('canvas');
    console.log(img.width, img.height);
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
    this.pods.push(canvas);
    document.getElementById(this.me).appendChild(canvas);
    this.loadNextPodium();
  }

  loadNextPodium() {
    let podSrc = this.podiumsToLoad.shift();
    let img = new Image();
    img.onload = this.handlePodiumLoad;
    if ( podSrc ) {
      img.src = podSrc;
    } else {
      img.onload = this.handleSrcLoad;
      img.src = this.props.src;
      this.img = img;
    }
  }

  plot(x, y, w, h, color) {
    let img = document.getElementById(this.imgId);
    let rect = document.createElement('div');
    document.getElementById(this.me).appendChild(rect);
    rect.classList.add('rect');
    rect.style.border = '1px solid ' + color;
    rect.style.width = w + 'px';
    rect.style.height = h + 'px';
    rect.style.left = (img.offsetLeft + x) + 'px';
    rect.style.top = (img.offsetTop + y) + 'px';
  };
  /* End Component Custom Methods */

  /* React Component LifeCycle Methods */
  //componentWillMount() {}
  componentDidMount() {
    this.loadNextPodium();
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