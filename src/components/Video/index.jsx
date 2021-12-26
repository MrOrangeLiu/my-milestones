import React, { Component } from 'react'
import Button from '@mui/material/Button'
import { videoUrl } from '../../share/constant'
import './index.css'

export default class Video extends Component {

    canvasRef = React.createRef()
    videoRef = React.createRef()
    state = {
        isPlaying: false
    }

    componentDidMount() {
        this.canvasInit()
    }

    // Initialize the player
    canvasInit = () => {
        this.createBorder()
    }

    createBorder = () => {
        const canvas = this.canvasRef.current
        const ctx = canvas.getContext("2d")
        ctx.lineWidth = 1 // Set border width
        ctx.strokeStyle = "black" // Set border color
        ctx.setLineDash([6,6]) // Set dot-dashed border style
        ctx.strokeRect(0,0,canvas.width,canvas.height) // Draw the border
    }

    createBottomLine = () => {
        const canvas = this.canvasRef.current
        const ctx = canvas.getContext("2d")
        ctx.beginPath()
        ctx.moveTo((canvas.width - this.videoRef.current.clientWidth)/2, (canvas.height - this.videoRef.current.clientHeight)/2 + this.videoRef.current.clientHeight)
        ctx.lineTo((canvas.width - this.videoRef.current.clientWidth)/2 + this.videoRef.current.clientWidth, (canvas.height - this.videoRef.current.clientHeight)/2 + this.videoRef.current.clientHeight)
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
        this.interval = setInterval(() => {
            const canvas = this.canvasRef.current
            const ctx = canvas.getContext("2d")
            ctx.drawImage(this.videoRef.current, (canvas.width - this.videoRef.current.clientWidth)/2, (canvas.height - this.videoRef.current.clientHeight)/2)
            this.createBottomLine();
        }, 20);
    }

    onPause = () => {
        clearInterval(this.interval)
    }

    render() {
        return (
            <div>
                <div className="canvas-area">
                    <canvas ref={this.canvasRef} width="360" height="640"></canvas>
                    <video className="hiddenVideo" ref={this.videoRef} src={videoUrl} onPlay={this.onPlay} onPause={this.onPause}></video>
                </div>
                <div className="button-group">
                    <Button variant="contained" onClick={this.playOrPause}>{!this.state.isPlaying ? '播放' : '暂停'}</Button>
                </div>
            </div>
        )
    }
}
