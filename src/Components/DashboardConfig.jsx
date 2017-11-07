import React, { Component } from 'react';
import {DashboardConfigLi as Li,DashboardConfigLi2 as Li2} from './DashboardConfigLi';

class DashboardConfig extends Component {
  constructor(){
    super();
    this.state={
      show:'closed'
    };
    this.toggleOnBlur =()=>{
      if(this.state.show === 'opened'){
        this.setState({
          show:'closed'
        });
      }
    }
  }
  toggleShowConfig(){
      this.setState({
        show:((this.state.show === 'opened') ? 'closed' : 'opened')
      });
  }
  render() {
    const LIST = [
        {id:'config-fixed-header' ,name:'Fixed Header'}
        //,{id:'config-fixed-sidebar' ,name:'Fixed Left Menu'}
        ,{id:'config-fixed-footer' ,name:'Fixed Footer'}
        ,{id:'config-boxed-layout' ,name:'Boxed Layout'}
       // ,{id:'config-rtl-layout' ,name:'Right-to-Left'}
    ].map((val)=>{
      return <Li obj={val} />
    });
    const LIST2 = [
        {title:'Default' ,klass:'' ,name:'theme-default',stile:{backgroundColor: '#34495e'} }
        ,{title:'White/Green' ,klass:'' ,name:'theme-white',stile:{backgroundColor: '#2ecc71'} }
        ,{title:'Gradient' ,klass:'blue-gradient',name:'theme-blue-gradient',stile:{} }
        ,{title:'Green Sea' ,klass:'' ,name:'theme-turquoise',stile:{backgroundColor: '#1abc9c'}}
        ,{title:'Amethyst' ,klass:'' ,name:'theme-amethyst',stile:{backgroundColor: '#9b59b6'}}
        ,{title:'Blue' ,klass:'' ,name:'theme-blue',stile:{backgroundColor: '#2980b9'}}
        ,{title:'Red' ,klass:'' ,name:'theme-red',stile:{backgroundColor: '#e74c3c'}}
        ,{title:'White/Blue' ,klass:'' ,name:'theme-whbl',stile:{backgroundColor: '#3498db'} }
    ].map((val)=>{
      return <Li2 obj={val} />
    }); 
    
    return (
    	<div tabIndex="0" onBlur={this.toggleOnBlur} id="config-tool" className={this.state.show}>
        <a id="config-tool-cog" onClick={this.toggleShowConfig.bind(this)} > <i className="fa fa-cog"></i> </a>
          <div id="config-tool-options">
             <h4>Layout Options</h4>
             <ul> {LIST} </ul>
        <br/>
            <h4>Skin Color</h4>
            <ul id="skin-colors" className="clearfix"> {LIST2} </ul>
      </div>
      </div>   	
    );
  }
}

export default DashboardConfig;
