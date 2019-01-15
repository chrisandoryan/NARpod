import React, { Component, Fragment } from 'react';
import './App.css';
import AceEditor from 'react-ace';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import Dropzone from 'react-dropzone';
import Modal from 'react-responsive-modal';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import ContentEditable from 'react-contenteditable'

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

import 'brace/mode/java';
import 'brace/theme/github';

class App extends Component {

  note = () => {
    return (
      <AceEditor
        mode="java"
        theme="github"
        value={this.state.displayContent}
        onChange={this.onChange}
        name="editor"
        height={window.innerHeight}
        fontSize={18}
        editorProps={{ $blockScrolling: Infinity }}
      />
    )
  }

  handleChange = e => {
    alert(e.target.value);
  };

  mapping = () => {
    return (
      <div className="wrapper">
        <header>
          <a href="javascript:void(0)" class="hide-list"><i class="fa fa-th"></i></a>
        </header>
        <div className="container">
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
        </div>
      </div>
    )
  }

  constructor(props) {
    super(props);
    this.state = {
      toggleClass: true,
      modalOpen: false,
      files: [],
      selectedFile: {},
      displayContent: '',
      selectedFilePosition: -1,
    }
    this.contentEditable = React.createRef();
  }

  render() {
    return (
      <React.Fragment>
        <div className={`container-fluid ${this.state.toggleClass ? 'toggled' : ''}`}>
          <div className="sidebar">
            <SideNav
              onSelect={(selected) => {
                // Add your code here

              }}
            >
              <SideNav.Toggle
                onClick={() => {
                  this.setState({ toggleClass: !this.state.toggleClass })
                }}
              />
              <SideNav.Nav defaultSelected="">
                <NavItem eventKey="upload" onClick={this.onOpenModal}>
                  <NavIcon>
                    <i className="fa fa-sticky-note " style={{ fontSize: '1.75em' }} />
                  </NavIcon>
                  <NavText>
                    Note
                </NavText>
                </NavItem>
                <NavItem eventKey="files">
                  <NavIcon>
                    <i className="fa fa-desktop" style={{ fontSize: '1.75em' }} />
                  </NavIcon>
                  <NavText>
                    Bench Mapping
                </NavText>
                  {
                    this.state.files.map((file, i) => (
                      <NavItem eventKey="files/viewfile" key={i} onClick={() => { this.displayContent(i) }}>
                        <NavText>
                          {file.fileName}
                        </NavText>
                      </NavItem>
                    ))
                  }
                </NavItem>
              </SideNav.Nav>
            </SideNav>
          </div>
          <div className="content">
            <Router>
              <Fragment>
                <Route exact path="/" component={this.note} />
                <Route exact path="/mapping" component={this.mapping} />
              </Fragment>
            </Router>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

// https://codepen.io/mattiabericchia/pen/xbQjew list-grid

export default App;
