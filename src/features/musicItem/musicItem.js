import React, {useEffect, useState} from 'react';
import play from '../../img/play.png'
import pause from '../../img/pause.png'
import './style.css'

const MusicItem = ({data, selectMusic, setSelectMusic, startMusic, isPlaying, setIsPlaying}) => {

    const [isPlayingus, setIsPlayingus] = useState(true)

    const handlerStart = (e) => {
        if (isPlayingus) {
            setIsPlayingus(false)
            setSelectMusic({...selectMusic, nameMusic: e})
            setTimeout(() => {
                startMusic()
            }, 100)
        } else {
            setIsPlayingus(true)
            setSelectMusic({...selectMusic, nameMusic: ''})
            setTimeout(() => {
                setIsPlaying(false)
                startMusic()
            }, 100)
        }
        console.log(selectMusic)
    }

    useEffect(() => {
        if (isPlaying && !isPlayingus) {
            setIsPlayingus(false)
        } else {
            setIsPlayingus(true)
        }

    }, [isPlaying])

    return (
        <>
            <section className='musicItem'>
                <section className='musicItem-left'>
                    {
                        !isPlayingus ? <img onClick={() => {handlerStart(data.music)}} className='musicItem-img' src={pause} alt="pause"/> : <img onClick={() => {handlerStart(data.music)}} className='musicItem-img' src={play} alt="play"/>
                    }
                    <div className='musicItem-desh'></div>
                    <h3 className='musicItem-title'>{data.title}</h3>
                </section>
                <span className='musicItem-right'>0:01 / 3:21</span>
            </section>
        </>
    );
};

export default MusicItem;
