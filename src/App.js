import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { render } from 'react-dom';
import brace from 'brace';
import AceEditor from 'react-ace';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import Dropzone from 'react-dropzone';
import Modal from 'react-responsive-modal';
import StringSimilarity from 'string-similarity';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

import 'brace/mode/java';
import 'brace/theme/github';

const patterns = {
  output: /System.out.print(ln|f)?\(.+\);/,
  outputl: /System.out/,
  input: /(import java.util.(\*|Scanner);)(.|\n)+?(\w+\.next(Line|Int|Double)\(\);)/s,
  inputl: /.*?Scanner.*?/,
  floop: /for\s*\(int \w+\s*=\s*\d;\s*\w\s*(<|>|<=|>=)\s*.+;\s*\w+(\+\+|\-\-)\)\s*\{((.|\n)+?)\}/gms,
  floopl: /for\(int.*?/,
  dwloop: /(do\s*\{((.|\n)+?)\}\s*while(.+);)/gms,
  wloop: /'while\((.+)\)\s*\{((.|\n)+?)\}/gms,
  switchcase: /'switch\s*\(\w+\)\s*\{(.|\n)+?case .+?:((.|\n)+?;)(.|\n)+?break;(.|\n)+?\}/gms,
  if: /if\s*\(.+\)\s*\{((.|\n)+?)\}/gms,
  declare_array: /.+(\[\])? \w+?(\[\])?\s*=\s*new \w+\[.+?\];/,
  declare_arrlist: /(ArrayList\s*<.+?> .+?\s*=\s*new ArrayList\s*<(.+?)?>\((.+?)?\);)/,
  declare_vector: /((Vector\s*<(.+?)> .+?)\s*=\s*new Vector\s*<(.+?)?>\((.+?)?\);)/,
  arlvec_usage: /(.+?\.((add|get|set|size|)\(.*?\));)/
}

const renderCorrectionResult = (
    fileName,
    inputScore,
    outputScore,
    loopScore,
    selectionScore,
    arrayDeclareScore,
    arrayUsageScore
  ) => {
  return `

    Filename: ${fileName}

    Automated Correction Result
    ---------------------------
    Input               : ${inputScore} / 3
    Output              : ${outputScore} / 3
    Looping             : ${loopScore} / 5
    Selection           : ${selectionScore} / 5
    Array Declaration   : ${arrayDeclareScore} / 3
    Array Usage         : ${arrayUsageScore} / 3

  `
}

class App extends Component {
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
    
  }

  navigateUsingKeystroke = (e) => {
    //right
    if(e.keyCode === 39) { 
      if(this.state.selectedFilePosition + 1 >= 0 && this.state.selectedFilePosition + 1 < this.state.files.length) {
        this.setState({
          selectedFilePosition: this.state.selectedFilePosition + 1,
          selectedFile: this.state.files[this.state.selectedFilePosition + 1]
        });
        console.log(this.state.files[this.state.selectedFilePosition]);
        this.testAutomatedCorrection(this.state.selectedFile.fileContent);
      }
    }
    //left
    if(e.keyCode === 37) {
      if(this.state.selectedFilePosition - 1 >= 0 && this.state.selectedFilePosition - 1 < this.state.files.length) {
        this.setState({
          selectedFilePosition: this.state.selectedFilePosition - 1,
          selectedFile: this.state.files[this.state.selectedFilePosition - 1]
        });
        console.log(this.state.files[this.state.selectedFilePosition]);
        this.testAutomatedCorrection(this.state.selectedFile.fileContent);
      }
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.navigateUsingKeystroke, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.navigateUsingKeystroke, false);
  }

  onChange = (newValue) => {
    console.log('change', newValue);
  }

  onDrop(files) {
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result;
        this.state.files.push({
          fileName: file.name,
          fileContent: fileContent,
          lastModified: file.lastModifiedDate,
          fileType: file.type
        })

        this.setState({ files: this.state.files });
        console.log(this.state.files);
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsBinaryString(file);
      this.onCloseModal();
    });
  }

  onCancel() {
    // this.setState({ files: [] });
  }

  onOpenModal = () => {
    this.setState({ openModal: true });
  };

  onCloseModal = () => {
    this.setState({ openModal: false });
  };

  displayContent = (i) => {
    this.setState({ selectedFile: this.state.files[i], displayContent: this.state.files[i].fileContent })
    console.log(this.state.selectedFile);
  }

  testInputSyntax = (ans) => {
    return ans.match(patterns.input)
  }

  testOutputSyntax = (ans) => {
    return ans.match(patterns.output);
  }

  testForLoopSyntax = (ans) => {
    return ans.match(patterns.floop)
  }

  testDoWhileLoopSyntax = (ans) => {
    return ans.match(patterns.dwloop);
  }

  testWhileLoopSyntax = (ans) => {
    return ans.match(patterns.wloop);
  }

  testIfSelectionSyntax = (ans) => {
    return ans.match(patterns.if);
  }

  testSwitchSelectionSyntax = (ans) => {
    return ans.match(patterns.switchcase);
  }

  testArrayDeclarationSyntax = (ans) => {
    return ans.match(patterns.declare_array);
  }

  testArrayDeclarationSyntax = (ans) => {
    return ans.match(patterns.declare_array);
  }

  testArrayListDeclarationSyntax = (ans) => {
    return ans.match(patterns.declare_arrlist);
  }

  testVectorDeclarationSyntax = (ans) => {
    return patterns.declare_vector.exec(ans);
  }

  testArlVecUsageSyntax = (ans) => {
    return patterns.arlvec_usage.exec(ans);
  }

  safelyNullifyResult = (result, position) => {
    console.log(result);
    if (result != null)
      return result[position];
    else
      return 'null';
  }

  testAutomatedCorrection = (ans) => {

    let checkInput = (this.testInputSyntax(ans))
    let checkOutput = (this.testOutputSyntax(ans))
    let checkFLoop = (this.testForLoopSyntax(ans))
    let checkDWLoop = (this.testDoWhileLoopSyntax(ans))
    let checkWLoop = (this.testWhileLoopSyntax(ans))
    let checkIfSelection = (this.testIfSelectionSyntax(ans))
    let checkSwitchSelection = (this.testSwitchSelectionSyntax(ans))
    let checkArrDeclare = (this.testArrayDeclarationSyntax(ans))
    let checkArrListDeclare = (this.testArrayListDeclarationSyntax(ans))
    let checkVecDeclare = (this.testVectorDeclarationSyntax(ans))
    let checkArlVecUsage = (this.testArlVecUsageSyntax(ans))
      

    this.setState({
      displayContent: renderCorrectionResult(
        this.state.selectedFile.fileName,
        checkInput ? 3 : ans.search('Scanner') >= 0 ? 1 : 0,
        checkOutput ? 3 : ans.search('System.out.print') >=0 ? 1 : 0,
        checkFLoop || checkDWLoop || checkWLoop ? 5 : ans.search('for') >=0 || ans.search('while') >=0 ? 3 : 1,
        checkIfSelection || checkSwitchSelection ? 5 : ans.search('if') >=0 || ans.search('switch') >=0 ? 3 : 1,
        checkArrDeclare || checkArrListDeclare || checkVecDeclare ? 3 : ans.search('Array') >=0 || ans.search('Vector') >=0 || ans.search('ArrayList') >=0 ? 1 : 0,
        checkArlVecUsage ? 3 : 0
      )
    });

  }

  render() {
    return (
      <React.Fragment>
        <div className={`container-fluid ${this.state.toggleClass ? 'toggled' : ''}`}>
          <Modal open={this.state.openModal} onClose={this.onCloseModal} center>
            <div className="file-dropzone">
              <Dropzone
                onDrop={this.onDrop.bind(this)}
                onFileDialogCancel={this.onCancel.bind(this)}
              >
                <p>Try dropping some files here, or click to select files to upload.</p>
              </Dropzone>
            </div>
          </Modal>
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
                    <i className="fa fa-fw fa-cloud-upload" style={{ fontSize: '1.75em' }} />
                  </NavIcon>
                  <NavText>
                    Upload File(s)
            </NavText>
                </NavItem>
                <NavItem eventKey="files">
                  <NavIcon>
                    <i className="fa fa-fw fa-files-o" style={{ fontSize: '1.75em' }} />
                  </NavIcon>
                  <NavText>
                    Corrections
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
                <NavItem eventKey="autocorrect" onClick={() => { this.testAutomatedCorrection(this.state.selectedFile.fileContent) }}>
                  <NavIcon>
                    <i className="fa fa-fw fa-check-circle-o" style={{ fontSize: '1.75em' }} />
                  </NavIcon>
                  <NavText>
                    Autocorrect
            </NavText>
                </NavItem>
              </SideNav.Nav>
            </SideNav>
          </div>
          <div className="content">
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
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
