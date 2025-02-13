import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Iterable, List } from "immutable"
import ImPropTypes from "react-immutable-proptypes"
import toString from "lodash/toString"


export default class OperationSummary extends PureComponent {

  static propTypes = {
    specPath: ImPropTypes.list.isRequired,
    operationProps: PropTypes.instanceOf(Iterable).isRequired,
    isShown: PropTypes.bool.isRequired,
    toggleShown: PropTypes.func.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    authActions: PropTypes.object,
    authSelectors: PropTypes.object,
  }

  static defaultProps = {
    operationProps: null,
    specPath: List(),
    summary: ""
  }

  handleKeyDown = (e) => {
//     if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
//       e.preventDefault()
// 
//       const opblock = e.target.closest("opblock is-open")
//       this.props.toggleShown()
//       // if (this.props.isShown) {
  //       //   alert("THEORETICALLY SHOWN")
  //       //   alert(this.props.isShown)
  //       // } else {
    //       //   // execute things
    //       //   alert("Is now closed")
    //       //   alert(this.props.isShown)
    //       //   // get the try it out button
    //       // }
    //         
    // 
    //         const tryOutBtn = opblock.getElementsByClassName("btn try-out__btn")[0]
    //         if (tryOutBtn && !tryOutBtn.disabled) {
      //           alert("Got the button")
      //         }
      //       }
      if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        if (e.key === 'ArrowUp') {
          console.log("arr up operation-summary")
          const focused = e.target
          const targetSpan = focused.closest("span")
          const prevSpan = targetSpan.previousSibling
          if (prevSpan) {
            const prevOperation = prevSpan.getElementsByClassName('opblock-summary-control')[0]
            prevOperation.focus()
            prevOperation.scrollIntoView({ behavior: 'smooth', block: 'center' })
          } else {
            const tagSection = targetSpan.closest('.opblock-tag-section')
            const targetTagSpan = tagSection.closest('span')
            const prevTagSpan = targetTagSpan.previousSibling
            if (prevTagSpan) {
              // TODO abstract this away so that CTRL + LeftArrow and CTRL + RightArrow can be used to quickly move between tag spans
              const prevTagSectionArrow = prevTagSpan.getElementsByClassName('expand-operation')[0]
              prevTagSectionArrow.focus()
              prevTagSectionArrow.click()
              
              // const simulateTab = () => {
              //   const event = new KeyboardEvent('keydown', {
              //     key: 'Tab',
              //     code: 'Tab',
              //     keyCode: 9,
              //     which: 9,
              //     bubbles: true,
              //     cancelable: true
              //   });
              //   document.dispatchEvent(event);
              // };
              // simulateTab()

              // const simulateTabNextFrame = () => {
              //   requestAnimationFrame(() => {
              //     const tabEvent = new KeyboardEvent('keydown', {
              //       key: 'Tab',
              //       code: 'Tab',
              //       keyCode: 9,
              //       which: 9,
              //       bubbles: true,
              //       cancelable: true,
              //       shiftKey: false
              //     });
              //     document.dispatchEvent(tabEvent);
              //   });
              // };
              // simulateTabNextFrame();
              // simulateTabNextFrame();
              // simulateTabNextFrame();

              const selectNextOp = () => {
                const maxAttempts = 10;
                let attempts = 0;
                
                const trySelectNextOp = () => {
                  if (attempts >= maxAttempts) {
                    console.log('Max attempts reached - target elements not found');
                    return;
                  }
                  
                  const targetElements = prevTagSpan.getElementsByClassName('opblock-summary-control');
                  
                  if (targetElements.length === 0) {
                    // Elements not found yet, retry
                    attempts++;
                    setTimeout(trySelectNextOp, 100);
                    return;
                  }
              
                  try {
                    // Find the first element after the currently focused one
                    const elementsArray = Array.from(targetElements);
                    const currentFocusIndex = elementsArray.indexOf(document.activeElement);
                    const nextElement = elementsArray[currentFocusIndex + 1] || elementsArray[0];
                    
                    if (nextElement) {
                      nextElement.focus();
                    }
                  } catch (error) {
                    console.log('Error focusing element:', error);
                    attempts++;
                    setTimeout(trySelectNextOp, 100);
                  }
                };
              
                trySelectNextOp();
              };
              selectNextOp();
              console.log("HEHEE")


              // const firstOp = prevSpan.getElementsByClassName('opblock-summary-control')[0]
              // firstOp.scrollIntoView({ behavior: 'smooth', block: 'center' })
              // firstOp.focus()
              // prevTagSpan.scrollIntoView({ behavior: 'smooth', block: 'center' })
            } else {
              return
            }
          }

          
          
        } else {
          console.log("arr down operation-summary")
      }
    }
  };

  render() {

    let {
      isShown,
      toggleShown,
      getComponent,
      authActions,
      authSelectors,
      operationProps,
      specPath,
    } = this.props

    let {
      summary,
      isAuthorized,
      method,
      op,
      showSummary,
      path,
      operationId,
      originalOperationId,
      displayOperationId,
    } = operationProps.toJS()

    let {
      summary: resolvedSummary,
    } = op

    let security = operationProps.get("security")

    const AuthorizeOperationBtn = getComponent("authorizeOperationBtn", true)
    const OperationSummaryMethod = getComponent("OperationSummaryMethod")
    const OperationSummaryPath = getComponent("OperationSummaryPath")
    const JumpToPath = getComponent("JumpToPath", true)
    const CopyToClipboardBtn = getComponent("CopyToClipboardBtn", true)
    const ArrowUpIcon = getComponent("ArrowUpIcon")
    const ArrowDownIcon = getComponent("ArrowDownIcon")

    const hasSecurity = security && !!security.count()
    const securityIsOptional = hasSecurity && security.size === 1 && security.first().isEmpty()
    const allowAnonymous = !hasSecurity || securityIsOptional
    return (
      <div className={`opblock-summary opblock-summary-${method}`} >
        <button
          aria-expanded={isShown}
          className="opblock-summary-control"
          onClick={toggleShown}
          onKeyDown={this.handleKeyDown}
        >
          <OperationSummaryMethod method={method} />
          <div className="opblock-summary-path-description-wrapper">
            <OperationSummaryPath getComponent={getComponent} operationProps={operationProps} specPath={specPath} />

            {!showSummary ? null :
              <div className="opblock-summary-description">
                {toString(resolvedSummary || summary)}
              </div>
            }
          </div>

          {displayOperationId && (originalOperationId || operationId) ? <span className="opblock-summary-operation-id">{originalOperationId || operationId}</span> : null}
        </button>
        <CopyToClipboardBtn textToCopy={`${specPath.get(1)}`} />
        {
          allowAnonymous ? null :
            <AuthorizeOperationBtn
              isAuthorized={isAuthorized}
              onClick={() => {
                const applicableDefinitions = authSelectors.definitionsForRequirements(security)
                authActions.showDefinitions(applicableDefinitions)
              }}
            />
        }
        <JumpToPath path={specPath} />{/* TODO: use wrapComponents here, swagger-ui doesn't care about jumpToPath */}
        <button
          aria-label={`${method} ${path.replace(/\//g, "\u200b/")}`}
          className="opblock-control-arrow"
          aria-expanded={isShown}
          tabIndex="-1"
          onClick={toggleShown}>
          {isShown ? <ArrowUpIcon className="arrow" /> : <ArrowDownIcon className="arrow" />}
        </button>
      </div>
    )
  }
}
