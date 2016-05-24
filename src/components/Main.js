require('normalize.css/normalize.css');
require('styles/App.css');
// require('styles/main.sass');
import React from 'react';
import ReactDOM from 'react-dom';


var imgDatas = require('../data/imgDatas.json');

imgDatas = (function(imgDataArr) {
    for (var i = 0, j = imgDataArr.length; i < j; i++) {
        var singleImgData = imgDataArr[i];
        singleImgData.imgUrl = require('../images/' + imgDataArr[i].fileName);
        imgDataArr[i] = singleImgData;
    }
    return imgDataArr;

})(imgDatas);

console.log('this is from main.js and the imgArr\'s length is ' + imgDatas.length);

var ImgFigure = React.createClass({

    /*
     * imgFigure的点击处理函数
     */
    handleClick: function(e) {

        this.props.inverse();
        e.stopPropagation();
        e.preventDefault();
    },
    render: function() {
        var styleObj = {};

        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }

        // 如果图片的旋转角度有值并且不为0， 添加旋转角度
        if (this.props.arrange.rotate) {
            (['-moz', '-ms-', '-webkit', '']).forEach(function(value) {
                styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
            }.bind(this));

            // styleObj['transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
        }

        var imgFigureClassName = "img-figure";
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';


        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                <img src={this.props.data.imgUrl}
                     alt={this.props.data.title}
                />
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" >
                        <p>
                            {this.props.data.desc}
                        </p>
                    </div>
                </figcaption>
            </figure>
        )
    }
})


/*
 * 获取区间内的一个随机值
 */
function getRangeRandom(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
}

/*
 * 获取0-30 之间的一个任意一个正负值
 */
function get30DegRandom() {
    return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
}

var AppComponent = React.createClass({
    Constant: {
        centerPos: {
            left: 0,
            top: 0
        },
        hPosRange: { //水平方向取值范围
            leftSecX: [0, 0],
            rightSecX: [0, 0],
            y: [0, 0]
        },
        vPosRange: { //垂直方向取值范围
            x: [0, 0],
            topY: [0, 0]
        }
    },

    /*
     * 翻转图片
     * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
     * @return {Function} 这是一个闭包函数， 其内return一个真正待执行的函数
     */

    inverse: function(index) {
        return function() {
            var imgsArrangeArr = this.state.imgsArrangeArr;

            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

            this.setState({
                imgsArrangeArr: imgsArrangeArr
            })
        }.bind(this);
    },
    /*
     * 重新布局所有图片
     * @param centerIndex 指定居中排布哪个图片
     */

    rearrange: function(centerIndex) {
        var imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,

            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
            topImgSpliceIndex = 0,

            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        // 首先居中 centerIndex 的图片
        imgsArrangeCenterArr[0].pos = centerPos;
        imgsArrangeCenterArr[0].rotate = 0;

        // 取出要布局上侧图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        // 布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(value, index) {
            imgsArrangeTopArr[index] = {
                pos: {
                    top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate: get30DegRandom()
            }
        })

        // 布局左右图片
        for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            var hPosRangeLORX = null;

            //前半部分布局在左边，右半部分在右边
            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            } else {
                hPosRangeLORX = hPosRangeRightSecX;
            }
            imgsArrangeArr[i] = {
                pos: {
                    top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                rotate: get30DegRandom()
            }
        }

        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
            imgsArrangeArr: imgsArrangeArr
        })
    },

    getInitialState: function() {
        return {
            imgsArrangeArr: [
                /* {
                    // 位置信息
                     pos: {
                         left: '0',
                         top: '0'
                     },
                     rotate: 0, // 旋转角度
                     isInverse: false // 图片正反面
                 }*/
            ]
        };
    },

    //组件加载后，为每张图片计算位置范围
    componentDidMount: function() {

        // 首先拿到舞台的大小
        var stageDOM = ReactDOM.findDOMNode(this.refs.stage), //只有在组件被加载以后才能通过findDOMNode拿到具体的DOM节点
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);

        //拿到一个imageFigure的大小
        var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = imgW / 2,
            halfImgH = imgH / 2;

        //计算中心图片位置
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        }

        //计算左右侧图片排布位置取值范围
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        // 计算上侧区域图片排布位置取值范围
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;
        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

        this.rearrange(0);
    },
    render: function() {
        var controllerUnits = [],
            imgFigures = [];
        imgDatas.forEach(function(value, index) {

            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false
                }
            }
            imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+ index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}/>);
        }.bind(this))

        return (
            <section className = "stage" ref="stage">
                <section className="img-sec">
                    {imgFigures}
                </section> 
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
            </section>
        );
    }
})

AppComponent.defaultProps = {};

export default AppComponent;