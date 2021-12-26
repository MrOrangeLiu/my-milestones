import React, { Component } from 'react'
import Button from '@mui/material/Button'
import { Rnd } from 'react-rnd'
import { videoUrl } from '../../share/constant'
import './index.css'

const rndStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
    background: "transparent"
};

export default class Video extends Component {

    canvasRef = React.createRef()
    cachedCanvasRef = React.createRef()
    videoRef = React.createRef()
    previewRef = React.createRef()
    state = {
        isInit: false,
        isPlaying: false,
        rndWidth: 200,
        rndHeight: 200,
        rndX: 1,
        rndY: 1
    }

    componentDidMount() {
        this.canvasInit()
    }

    componentDidUpdate(preProps, preState) {
        const canvas = this.canvasRef.current
        const ctx = canvas.getContext("2d")

        // Define the width and height of the cached canvas
        const cachedCtx = this.cachedCanvasRef.current.getContext("2d")
        this.cachedCanvasRef.current.width = this.state.rndWidth
        this.cachedCanvasRef.current.height = this.state.rndHeight

        if(this.shouldClearRect(preState)) {
            ctx.clearRect(preState.rndX,preState.rndY,preState.rndWidth,preState.rndHeight + 2)
            
            // Draw the cached frame immediately to prevent sparking
            cachedCtx.drawImage(this.videoRef.current, 0, 0, this.state.rndWidth, this.state.rndHeight)
            ctx.drawImage(this.cachedCanvasRef.current, this.state.rndX, this.state.rndY, this.state.rndWidth, this.state.rndHeight)
        }
        // Deal with the case when the video is paused
        if(!this.interval) {
            ctx.drawImage(this.videoRef.current, this.state.rndX, this.state.rndY, this.state.rndWidth, this.state.rndHeight)
        }
    }

    // Judge if we need clear the rectangle of that video
    shouldClearRect(preState) {
        const { rndX, rndY, rndWidth, rndHeight } = this.state
        const { rndX: preRndX, rndY: preRndY, rndWidth: preRndWidth, rndHeight: preRndHeight } = preState
        return preRndX !== rndX || preRndY !== rndY || preRndWidth !== rndWidth || preRndHeight !== rndHeight
    }

    // Initialize the player
    canvasInit = () => {
        this.createBorder()
    }

    // Create the border of the canvas
    createBorder = () => {
        const canvas = this.canvasRef.current
        const ctx = canvas.getContext("2d")
        ctx.lineWidth = 1 // Set border width
        ctx.strokeStyle = "black" // Set border color
        ctx.setLineDash([6,6]) // Set dot-dashed border style
        ctx.strokeRect(0,0,canvas.width,canvas.height) // Draw the border
    }

    // Create the bottom line of the video
    createBottomLine = (width, height, x, y) => {
        const canvas = this.canvasRef.current
        const ctx = canvas.getContext("2d")
        ctx.beginPath()
        ctx.moveTo(x, y + height)
        ctx.lineTo(x + width, y + height)
        ctx.lineWidth = 2
        ctx.strokeStyle = 'red'
        ctx.setLineDash([])
        ctx.stroke()
        ctx.closePath()
    }
    
    playOrPause = () => {        
        if(!this.state.isPlaying) {
            this.videoRef.current.play()
        } else {
            this.videoRef.current.pause()
        }
        this.setState({isPlaying: !this.state.isPlaying})
    }

    onPlay = () => {
        const canvas = this.canvasRef.current
        const ctx = canvas.getContext("2d")

        this.interval = setInterval(() => {
            ctx.drawImage(this.videoRef.current, this.state.rndX, this.state.rndY, this.state.rndWidth, this.state.rndHeight)
            // this.createBottomLine(this.state.rndWidth, this.state.rndHeight, this.state.rndX, this.state.rndY);
        }, 20);
    }

    onPause = () => {
        clearInterval(this.interval)
        this.interval = null
    }

    // When the video is ready, then initialize the dragging box
    onCanPlay = () => {
        const canvas = this.canvasRef.current
        this.rndInit(this.videoRef.current.clientWidth, this.videoRef.current.clientHeight, (canvas.width - this.videoRef.current.clientWidth)/2, (canvas.height - this.videoRef.current.clientHeight)/2)
    }

    rndInit = (width, height, x, y) => {
        this.setState({
            isInit: true,
            rndWidth: width,
            rndHeight: height,
            rndX: x,
            rndY: y
        })
    }

    render() {
        return (
            <div>
                <div className="canvas-area">
                    <div className="dragging-area"></div>
                    <div className="preview" ref={this.previewRef}></div>
                    <canvas ref={this.canvasRef} width="360" height="640"></canvas>
                    <canvas className="cachedCanvasRef" ref={this.cachedCanvasRef} ></canvas>
                    <Rnd
                        style={ {...rndStyle, visibility: !this.state.isInit ? 'hidden' : 'visible'} }
                        size={{ width: this.state.rndWidth, height: this.state.rndHeight }}
                        position={{ x: this.state.rndX, y: this.state.rndY }}
                        // onDragStop={(e, d) => {
                        //     this.setState({ rndX: d.x, rndY: d.y })
                        // }}
                        onDrag={(e, d) => {
                            this.setState({ rndX: d.x, rndY: d.y })
                        }}
                        // onResizeStop={(e, direction, ref, delta, position) => {
                        //     this.setState({
                        //         rndWidth: ref.style.width.substring(0, ref.style.width.length - 2),
                        //         rndHeight: ref.style.height.substring(0, ref.style.height.length - 2),
                        //         ...position
                        //     })
                        // }}
                        onResize={(e, direction, ref, delta, position) => {
                            this.setState({
                                rndWidth: ref.style.width.substring(0, ref.style.width.length - 2),
                                rndHeight: ref.style.height.substring(0, ref.style.height.length - 2),
                                rndX: position.x,
                                rndY: position.y
                            })
                        }}
                        bounds=".dragging-area"
                    >
                    </Rnd>
                    <video className="hiddenVideo" ref={this.videoRef} src={videoUrl} onPlay={this.onPlay} onPause={this.onPause} onCanPlay={this.onCanPlay} ></video>
                </div>
                <div className="button-group">
                    <Button variant="contained" onClick={this.playOrPause}>{!this.state.isPlaying ? '播放' : '暂停'}</Button>
                </div>
            </div>
        )
    }
}
