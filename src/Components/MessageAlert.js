import React, { Component } from 'react';

class MessageAlert extends Component {
	//<div dangerouslySetInnerHTML={{__html: this.props.pesan_error}} className={this.showHide()} />
	kelasAlert(){
		let pesan = this.props.pesan.teks ;
		if(!this.state.show){
			pesan = '';
		}
		return pesan ? (this.props.pesan.kelas ? this.props.pesan.kelas : 'alert alert-danger' ) : 'hidden';
	}
	tipeAlert(){
		return this.props.pesan.tipe ? this.props.pesan.tipe : 'Error';
	}
	constructor(){
		super();
		this.state={show:true};
		this.handleClick =()=>{
			if(typeof this.props.onClick === 'function')
			this.props.onClick();
		}
	}

	render() {
    	return (    		
    		<div className={this.kelasAlert()}>
    			<strong>{this.tipeAlert()} : </strong> {this.props.pesan.teks} <button onClick={this.handleClick} className="close" data-dismiss="alert">&times;</button>
    		</div>
    	);
  	}
}

export default MessageAlert;