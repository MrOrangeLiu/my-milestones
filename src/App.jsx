import React, { Component } from 'react'
import './App.css';
import Image from './components/Image'
import imageUrl from './assets/images/s2.png'

export default class App extends Component {

  imageCompRef = React.createRef();

  showImage = () => {
    this.imageCompRef.current.draw();
  }
  
  render() {
    return (
      <div>
        <Image ref={ this.imageCompRef } />
        <button onClick={ this.showImage }>开始</button>
      </div>
    )
  }
}
