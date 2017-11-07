import React, { Component } from 'react';
import Logo from '../Imgs/loading.gif';

class GambarLoading extends Component {
	showHide(){
		return this.props.show ? '' : 'hidden';
	}

  render() {
    return (
    	<div className={this.showHide()}>
    		<img src={Logo} alt="Loading ... " />
    	</div>    	
    );
  }
}

export default GambarLoading;
