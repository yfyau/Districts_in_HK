import React from "react"
import PropTypes from "prop-types"
import _ from "lodash"

import '../styles/PageScroller.css'

/*
    Reference to "react-page-scroller":
        https://github.com/VikLiegostaiev/react-page-scroller
*/


const ANIMATION_TIMER = 200;
const KEY_UP = 38;
const KEY_DOWN = 40;

export default class PageScroller extends React.Component {

    static propTypes = {
        animationTimer: PropTypes.number,
        transitionTimingFunction: PropTypes.string,
        pageOnChange: PropTypes.func,
        scrollUnavailable: PropTypes.func,
        containerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        containerWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        blockScrollUp: PropTypes.bool,
        blockScrollDown: PropTypes.bool,

        navOptions: PropTypes.array
    };

    static defaultProps = {
        animationTimer: 1000,
        transitionTimingFunction: "ease",
        containerHeight: "100vh",
        containerWidth: "100vw",
        blockScrollUp: false,
        blockScrollDown: false,

        navOptions: []
    };

    constructor(props) {
        super(props)

        this.state = {
            currentIndex: 0,
            currentToRenderLength: 0,
            sideDrawerOpen: false
        }

        this.previousTouchMove = null
        this.scrolling = false
    }

    componentDidMount = () => {
        window.addEventListener('resize', this.onWindowResized);

        document.ontouchmove = (event) => {
            event.preventDefault();
        };

        // this._pageContainer.addEventListener("touchmove", this.touchMove);
        this._pageContainer.addEventListener("keydown", this.keyPress);

        let componentsToRenderLength = 0;

        // ???
        if (!_.isNil(this.props.children[this.state.currentIndex])) {
            componentsToRenderLength++;
        } else {
            componentsToRenderLength++;
        }

        this.addNextComponent(componentsToRenderLength);
    };

    componentWillUnmount = () => {
        window.removeEventListener('resize', this.onWindowResized);

        // this._pageContainer.removeEventListener("touchmove", this.touchMove);
        this._pageContainer.removeEventListener("keydown", this.keyPress);
    };

    onWindowResized = () => {
        this.forceUpdate();
    };

    wheelScroll = (event) => {
        if (event.target.nodeName === "CANVAS")
            return

        if (event.deltaY < 0)
            this.scrollWindowUp();
        else
            this.scrollWindowDown();
    };

    touchMove = (event) => {
        if (!_.isNull(this.previousTouchMove)) {
            if (event.touches[0].clientY > this.previousTouchMove)
                this.scrollWindowUp();
            else
                this.scrollWindowDown();

        } else {
            this.previousTouchMove = event.touches[0].clientY;
        }
    };

    keyPress = (event) => {
        if (_.isEqual(event.keyCode, KEY_UP))
            this.scrollWindowUp();

        if (_.isEqual(event.keyCode, KEY_DOWN))
            this.scrollWindowDown();

    };

    scrollWindowUp = () => {
        if (!this.scrolling && !this.props.blockScrollUp) {
            if (!_.isNil(this["container_" + (this.state.currentIndex - 1)])) {
                this.scrolling = true;
                this._pageContainer.style.transform = `translate3d(0, ${(this.state.currentIndex - 1) * -100}%, 0)`;

                if (this.props.pageOnChange) {
                    this.props.pageOnChange(this.state.currentIndex);
                }

                this.setState((prevState) => ({ currentIndex: prevState.currentIndex - 1 }));
                setTimeout(() => {
                    this.scrolling = false;
                    this.previousTouchMove = null;
                }, this.props.animationTimer + ANIMATION_TIMER)

            } else if (this.props.scrollUnavailable) {
                this.props.scrollUnavailable();
            }
        }
    };

    scrollWindowDown = () => {
        if (!this.scrolling && !this.props.blockScrollDown) {
            if (!_.isNil(this["container_" + (this.state.currentIndex + 1)])) {
                this.scrolling = true;
                this._pageContainer.style.transform = `translate3d(0, ${(this.state.currentIndex + 1) * -100}%, 0)`;

                if (this.props.pageOnChange) {
                    this.props.pageOnChange(this.state.currentIndex + 2);
                }

                this.setState((prevState) => ({ currentIndex: prevState.currentIndex + 1 }), () => {
                    this.addNextComponent();
                });
                setTimeout(() => {
                    this.scrolling = false;
                    this.previousTouchMove = null;
                }, this.props.animationTimer + ANIMATION_TIMER)

            } else if (this.props.scrollUnavailable) {
                this.props.scrollUnavailable();
            }
        }
    };

    goToPage = (number) => {
        const { pageOnChange, children } = this.props;
        const { currentIndex, currentToRenderLength } = this.state;

        let newComponentsToRenderLength = currentToRenderLength;

        console.log(currentIndex, number, currentToRenderLength, !this.scrolling, !_.isNil(this["container_" + (number)]))

        if (!_.isEqual(currentIndex, number)) {
            if (!_.isNil(this["container_" + (number)]) && !this.scrolling) {

                this.scrolling = true;
                this._pageContainer.style.transform = `translate3d(0, ${(number) * -100}%, 0)`;

                if (pageOnChange) {
                    pageOnChange(number + 1);
                }

                if (_.isNil(this["container_" + (number + 1)]) && !_.isNil(children[number + 1])) {
                    newComponentsToRenderLength++;
                }


                this.setState({ currentIndex: number, currentToRenderLength: newComponentsToRenderLength });
                setTimeout(() => {
                    this.scrolling = false;
                    this.previousTouchMove = null;
                }, this.props.animationTimer + ANIMATION_TIMER)

            } else if (!this.scrolling && !_.isNil(children[number])) {
                for (let i = currentToRenderLength; i <= number; i++) {
                    newComponentsToRenderLength++;
                }

                if (!_.isNil(children[number + 1])) {
                    newComponentsToRenderLength++
                }

                this.scrolling = true;
                this.setState({
                    currentToRenderLength: newComponentsToRenderLength
                }, () => {
                    this._pageContainer.style.transform = `translate3d(0, ${(number) * -100}%, 0)`;

                    if (pageOnChange) {
                        pageOnChange(number + 1);
                    }

                    this.setState({ currentIndex: number });
                    setTimeout(() => {
                        this.scrolling = false;
                        this.previousTouchMove = null;
                    }, this.props.animationTimer + ANIMATION_TIMER)
                });
            }
        }
    };

    addNextComponent = (componentsToRenderOnMountLength) => {
        let componentsToRenderLength = 0;

        if (!_.isNil(componentsToRenderOnMountLength))
            componentsToRenderLength = componentsToRenderOnMountLength;

        componentsToRenderLength = Math.max(componentsToRenderLength, this.state.currentToRenderLength);

        if (componentsToRenderLength <= this.state.currentIndex + 1) {
            if (!_.isNil(this.props.children[this.state.currentIndex + 1]))
                componentsToRenderLength++;
        }

        this.setState({ currentToRenderLength: componentsToRenderLength });
    };

    setRenderComponents = () => {
        const newComponentsToRender = [];

        for (let i = 0; i < this.state.currentToRenderLength; i++) {
            if (!_.isNil(this.props.children[i])) {
                newComponentsToRender.push(
                    <div key={i} ref={c => this["container_" + i] = c}
                        style={{ height: "100%", width: "100%", overflow: "hidden" }}>
                        {this.props.children[i]}
                    </div>
                );
            } else {
                break;
            }
        }

        return newComponentsToRender;
    };


    // For NavBar
    drawerToggleClickHandler = () => {
        this.setState((prevState) => {
            return { sideDrawerOpen: !prevState.sideDrawerOpen }
        })
    }



    render() {
        const { animationTimer, transitionTimingFunction, containerHeight, containerWidth } = this.props;
        const { navOptions } = this.props;
        const { currentIndex, sideDrawerOpen } = this.state


        const number = this.props.children && this.props.children.length

        return (
            <div className="page-scroller" style={{ height: containerHeight, width: containerWidth }}>
                <div className="page-container"
                    ref={ref => this._pageContainer = ref}
                    onWheel={this.wheelScroll}
                    style={{ transition: `transform ${animationTimer}ms ${transitionTimingFunction}` }}
                    tabIndex={0}>
                    {this.setRenderComponents()}
                </div>
            </div>
        )
    }
}
