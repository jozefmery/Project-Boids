/**
 * File: P5Sketch.tsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 24.3.2020
 * License: none
 * Description: Defines a simple p5 wrapper React component.
 * 
 */

// import dependencies
import React, { Component } from "react";
import P5 from "p5";
import classNames from "classnames";

interface EmptyCallback {

    (): void;
}



type P5SketchProps = {

    classNames?: Parameters<typeof classNames>[0];
    id?: string;
    // p5 setup
    preload?: (p5: P5) => void;
    setup: (p5: P5, parent: HTMLDivElement) => void;
    // p5 events
    draw?: EmptyCallback;
    windowResized?: EmptyCallback;
    // react events
    onWheel?: React.EventHandler<React.WheelEvent>;
    onClick?: React.EventHandler<React.MouseEvent>;
    onDoubleClick?: React.EventHandler<React.MouseEvent>;
    onMouseDown?: React.EventHandler<React.MouseEvent>;
    onMouseUp?: React.EventHandler<React.MouseEvent>;
    onMouseMove?: React.EventHandler<React.MouseEvent>;
    onMouseEnter?: React.EventHandler<React.MouseEvent>;
    onMouseLeave?: React.EventHandler<React.MouseEvent>;
    onKeyDown?: React.EventHandler<React.KeyboardEvent>;
    onKeyUp?: React.EventHandler<React.KeyboardEvent>;
    onTouchStart?: React.EventHandler<React.TouchEvent>;
    onTouchMove?: React.EventHandler<React.TouchEvent>;
    onTouchEnd?: React.EventHandler<React.TouchEvent>;
};

export default class P5Sketch extends Component<P5SketchProps> {

    /// Public static members

    public static readonly defaultProps = {

        classNames: "asd",
        id: "p5-sketch"
    };

    /// Private members

    private canvasParent: React.RefObject<HTMLDivElement>;
    private p5: P5 = null as any; // initialized after mounting

    /// Constructor function

    public constructor(props: P5SketchProps) {

        super(props);

        this.canvasParent = React.createRef();
    }

    /// Private methods

    private instantiateP5() {

        this.p5 = new P5((p5: P5) => {

            if(this.props.preload) {

                // cast to original type
                // check is provided above
                p5.preload = () => (this.props.preload as (p5: P5) => void)(p5);
            }
            
            // cast canvasParent to div because it can't be undefined at this point
            p5.setup = () => this.props.setup(p5, this.canvasParent.current as HTMLDivElement);
        });
    }

    private setP5events() {

        // cast to empty callback even if undefined
        // to enable removing callbacks
        this.p5.draw = this.props.draw as EmptyCallback;
        this.p5.windowResized = this.props.windowResized as EmptyCallback;
    }

    /// Public methods

    public componentDidMount() {

        this.instantiateP5();
        this.setP5events();
    }
    
    public componentDidUpdate() {
        
        this.setP5events();
    }

    public componentWillUnmount() {

        this.p5.remove();
    }

    public render() {

        const { 
            // extract redundant props
            preload,
            setup,
            windowResized,
            draw,
            // extract class list to be called with classNames
            classNames: classList,
            // extract rest of event handlers
            ...props 
        } = this.props;

        return <div ref={this.canvasParent} 
                    className={classNames(classList)}
                    tabIndex={0} // enable keyboard events
                    // pass event handlers as is
                    { ...props }
                    />;
    }
};