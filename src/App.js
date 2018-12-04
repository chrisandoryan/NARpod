import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { render } from 'react-dom';
import brace from 'brace';
import AceEditor from 'react-ace';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import Dropzone from 'react-dropzone';
import Modal from 'react-responsive-modal';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

import 'brace/mode/java';
import 'brace/theme/github';

const patterns = {
  output: /System.out.print(ln|f)?\(.+\);/,
  input: /(import java.util.(\*|Scanner);)(.|\n)+?(\w+\.next(Line|Int|Double)\(\);)/s,
  floop: /for\s*\(int \w+\s*=\s*\d;\s*\w\s*(<|>|<=|>=)\s*.+;\s*\w+(\+\+|\-\-)\)\s*\{((.|\n)+?)\}/gms,
  dwloop: /(do\s*\{((.|\n)+?)\}\s*while(.+);)/gms,
  wloop: /'while\((.+)\)\s*\{((.|\n)+?)\}/gms,
  switchcase: /'switch\s*\(\w+\)\s*\{(.|\n)+?case .+?:((.|\n)+?;)(.|\n)+?break;(.|\n)+?\}/gms,
  if: /if\s*\(.+\)\s*\{((.|\n)+?)\}/gms,
  declare_array: /.+(\[\])? \w+?(\[\])?\s*=\s*new \w+\[.+?\];/gms,
  declare_arrlist: /(ArrayList\s*<.+?> .+?\s*=\s*new ArrayList\s*<(.+?)?>\((.+?)?\);)/gms,
  declare_vector: /(Vector\s*<(.+?)> .+?\s*=\s*new Vector\s*<(.+?)?>\((.+?)?\);)/gms
}

const renderResultTemplate = (
  fileName, 
  inputResult, 
  outputResult, 
  loopResult, 
  selectionResult, 
  arrayDeclare, 
  arrayUsage) => {
  return `
Filename: ${fileName}

Automated Correction Result
---------------------------
I   O   Loop    Selection   ArrayDeclare    ArrayUsage
3   3   1       3           1               0


Manual Review Section
---------------------

----------------------------------------------------------------------------------------------------------
[I]

${inputResult}    


__________________________________________________________________________________________________________


----------------------------------------------------------------------------------------------------------
[O]

${outputResult}


__________________________________________________________________________________________________________


----------------------------------------------------------------------------------------------------------
[Loop]

${loopResult}


__________________________________________________________________________________________________________


----------------------------------------------------------------------------------------------------------
[Selection]

${selectionResult}


__________________________________________________________________________________________________________


----------------------------------------------------------------------------------------------------------
[ArrayDeclare]

${arrayDeclare}


__________________________________________________________________________________________________________


----------------------------------------------------------------------------------------------------------
[ArrayUsage]

${arrayUsage}


__________________________________________________________________________________________________________
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
      displayContent: ''
    }
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

  testArrayUsageSyntax = (ans) => {

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
    this.setState({
      displayContent: renderResultTemplate(
        this.state.selectedFile.fileName,
        checkInput[1] || 'null' + '\n' + checkInput[4] || 'null',
        checkOutput[0] || 'null',
        checkFLoop || 'null' + '\n' + checkDWLoop || 'null' + '\n' + checkWLoop || 'null',
        'f',
        'g',
        'e'
      )
    })
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
                      <NavItem eventKey="files/linechart" key={i} onClick={() => { this.displayContent(i) }}>
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
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
