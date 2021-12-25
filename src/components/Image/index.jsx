import React, { Component } from 'react'
// import imageUrl from '../../assets/images/s2.png' // Local image
import { imageUrl } from '../../share/constant' // Remote image

export default class Image extends Component {

    canvasRef = React.createRef();
    image = null;

    componentDidMount() {
        this.canvasInit();
    }

    // Initialize the border
    canvasInit = () => {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.lineWidth = 1; // Set border width
        ctx.strokeStyle = "black";// Set border color
        ctx.setLineDash([6,6]); // Set dot-dashed border style
        ctx.strokeRect(0,0,canvas.width,canvas.height);// Draw the border
    }

    // Call when the start button is clicked
    draw = () => {
        if(this.image) return;
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");
        this.image = new window.Image();
        this.image.src = imageUrl;
        this.image.onload = () => {
            ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);
        };
    }

    render() {
        return (
            <div>
                <canvas ref={this.canvasRef} width = "360px" height = "640px">
                    Your browser does not support canvas, please use Chrome or qeuivalent.
                </canvas>
            </div>
        )
    }
}
