import React, { Component } from 'react';
import LS from '../Action/LocalStorage';

export class DashboardConfigLi extends Component {
	constructor(){
		super();
		this.state={
			
		};	

		this.handleClick = (e)=>{
			LS.set(e.currentTarget.getAttribute('data-id'), !this.state.checkBox );
			this.setState({
				checkBox:!this.state.checkBox
			});
			
		};
	}
	render(){		
		switch(this.props.obj.id){
			case 'config-fixed-header':
				if(typeof this.state.checkBox === 'undefined'){
					this.setState({
						checkBox : (LS.get('config-fixed-header') === 'true' ? true :false)
					});
				}
				let KLASS = document.body.getAttribute('class') ;
				KLASS = this.state.checkBox ? (KLASS.match(/fixed-header/) ? KLASS : KLASS + ' fixed-header'  )  : KLASS.replace(/fixed-header/g,'') ;				
				document.body.className = KLASS;
				break;
			case 'config-fixed-footer':
				if(typeof this.state.checkBox === 'undefined'){
					this.setState({
						checkBox : (LS.get('config-fixed-footer') === 'true' ? true :false)
					});
				}
				this.state.checkBox === true ? document.body.classList.add('fixed-footer') : document.body.classList.remove('fixed-footer');
				break;
			case 'config-boxed-layout':
				if(typeof this.state.checkBox === 'undefined'){
					this.setState({
						checkBox : (LS.get('config-boxed-layout') === 'true' ? true :false)
					});
				}
				this.state.checkBox === true ? document.body.classList.add('boxed-layout') : document.body.classList.remove('boxed-layout');
				break;
			default:break;
		}

		return(
			<li>
               <div className="checkbox-nice" onClick={this.handleClick} data-id={this.props.obj.id}>
                <input type="checkbox" id={this.props.obj.id} checked={this.state.checkBox ? true : false} />
                <label for={this.props.obj.id}> {this.props.obj.name} </label>
               </div>
            </li>
		);
	}
}

export class DashboardConfigLi2 extends Component{
	constructor() {
		super();
		this.state={};
		this.handleClick = (e)=>{
			document.body.classList.remove( LS.get('body-tema') );
			document.body.classList.add( e.currentTarget.getAttribute('data-skin') ) ;
			LS.set('body-tema',e.currentTarget.getAttribute('data-skin'));
		};
	}
	render(){
		const kelas = 'skin-changer ' + this.props.obj.klass ;
		return(
			<li>
		      <a onClick={this.handleClick} className={kelas} data-skin={this.props.obj.name} data-toggle="tooltip" title={this.props.obj.title} style={this.props.obj.stile} > </a>
		    </li>
		);
	}
}