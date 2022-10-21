import React, {useEffect, useRef, useState} from 'react';
import './style.css'

const Slider = ({onChange, percentage}) => {
    const [position, setPosition] = useState(0)
    const [marginLeft, setMarginLeft] = useState(-10)
    const [progressBarWidth, setProgressBarWidth] = useState(-10)

    const rangeRef = useRef()
    useEffect(() => {
        const rangeWidth = rangeRef.current.getBoundingClientRect().width
        const thumbWidth = 20
        const centerThumb = (thumbWidth / 100) * percentage * -1
        const centerProgressBar = thumbWidth + rangeWidth/100 * percentage - (thumbWidth/100 * percentage)
        setMarginLeft(centerThumb)
        setPosition(percentage)
        setProgressBarWidth(centerProgressBar)
    }, [percentage])
    return (
        <>
            <div className='slider-container'>
                <div className='progress-bar-cover' style={{
                    width: `${progressBarWidth}px`
                }}></div>
                <div className='thumb' style={{
                    left: `${position}%`,
                    marginLeft: `${marginLeft}px`
                }}></div>
                <input step='0.01' value={position} ref={rangeRef} className='player-range' type="range" onChange={onChange}/>
            </div>
        </>
    );
};

export default Slider;
