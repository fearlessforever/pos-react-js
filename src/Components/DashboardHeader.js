import React, { Component } from 'react';
import DashboardHeaderNavBar from './DashboardHeaderNavBar';

class DashboardHeader extends Component {
	constructor(){
		super();
		this.handleClick = ()=>{
			if(typeof this.props.func === 'function')
				this.props.func();
		};
		this.handleClick2 = ()=>{
			if(typeof this.props.func2 === 'function')
				this.props.func2();
		};
	}

	render(){
		return(
			<header className="navbar" id="header-navbar">
				<div className="container">
					<a href="/" id="logo" className="navbar-brand">
						<img src="/external/img/logo.png" alt="" className="normal-logo logo-white"/>
						<img src="/external/img/logo-black.png" alt="" className="normal-logo logo-black"/>
						<img src="/external/img/logo-small.png" alt="" className="small-logo hidden-xs hidden-sm hidden"/>
					</a>
					<div className="clearfix">
						<button onClick={this.handleClick2} className="navbar-toggle" data-target=".navbar-ex1-collapse" data-toggle="collapse" type="button">
							<span className="sr-only">Toggle navigation</span>
							<span className="fa fa-bars"></span>
						</button>
						<div className="nav-no-collapse navbar-left pull-left hidden-sm hidden-xs">
						<ul className="nav navbar-nav pull-left">
							<li>
							<a onClick={this.handleClick} className="btn" id="make-small-nav"> <i className="fa fa-bars"></i> </a>
							</li>
						</ul>
						</div>

						<DashboardHeaderNavBar />
					</div>

				</div>
			</header>
		);
	}
}

export default DashboardHeader;