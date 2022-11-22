import React, {useState} from 'react';
import './style.sass'
import Header from "../../widgets/header/header";
import newPost from "../../img/pencil.png";
import check from "../../img/check.png";
import music from "../../img/music.png";
import play from '../../img/play.png'
import pause from "../../img/pause.png";
import Github from "../../features/github/github";
import MusicItem from "../../features/musicItem/musicItem";
import {getAuth} from "firebase/auth";
import {useRef} from "react";
import Slider from "../../features/slider/slider";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "../../shared/api/firebase";
import {addDoc, collection, getFirestore, onSnapshot, orderBy, query, Timestamp} from "firebase/firestore";
import {useEffect} from "react";

const Music = () => {

    const auth = getAuth()
    const db = getFirestore()

    const [open, setOpen] = useState(true)
    const [error, setError] = useState('')
    const [percentage, setPercentage] = useState(0)
    const [musics, setMusics] = useState([])
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [data, setData] = useState({
        music: {},
        title: '',
        uid: auth.currentUser.uid
    })
    const [selectMusic, setSelectMusic] = useState({
        playing: false,
        nameMusic: ''
    })

    const onChange = (e) => {
        const audio = audioRef.current
        audio.currentTime = (audio.duration / 100) * e.target.value
        setPercentage(e.target.value)
    }

    const audioRef = useRef()
    const openPostHandler = () => {open ? setOpen(false) : setOpen(true)}

    const startMusic = (e) => {
        const audio = audioRef.current
        audio.volume = 1

        if (!isPlaying) {
            setIsPlaying(true)
            audio.play()
        } else {
            setIsPlaying(false)
            audio.pause()
        }
    }

    const secondsToHms = (seconds) => {
        if (!seconds) return '00m 00s'

        let duration = seconds
        let hours = duration / 3600
        duration = duration % 3600

        let min = parseInt(duration / 60)
        duration = duration % 60

        let sec = parseInt(duration)

        if (sec < 10) {
            sec = `0${sec}`
        }
        if (min < 10) {
            min = `0${min}`
        }

        if (parseInt(hours, 10) > 0) {
            return `${parseInt(hours, 10)}h ${min}m ${sec}s`
        } else if (min == 0) {
            return `00m ${sec}s`
        } else {
            return `${min}m ${sec}s`
        }

    }

    const getCurrDuration = (e) => {
        const percent = ((e.currentTarget.currentTime / e.currentTarget.duration) * 100).toFixed(2)
        const time = e.currentTarget.currentTime /// 60
        const audio = audioRef.current

        if (e.currentTarget.currentTime === e.currentTarget.duration) {
            setIsPlaying(false)
            audio.pause()
        }

        setPercentage(+percent)
        setCurrentTime(time.toFixed(2))
    }

    const sendMusicHandler = async () => {
        if (auth.currentUser.uid !== 'CmG7f8TGwDPEouwwNqnYUJmB5lr1') {
            setError('У вас недостаточно прав!')
            setData({
                music: {},
                title: '',
                uid: auth.currentUser.uid
            })
            setTimeout(() => {
                setError('')
            }, 1000)
            return null
        }
        console.log(data.music)

        if (data.music) {
            const musicRef = ref(
                storage,
                `music/${new Date().getTime()} - ${data.music.name}`
            )
            const snap = await uploadBytes(musicRef, data.music)
            const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath))
            data.music = dlUrl
        }

        await addDoc(collection(db, "music"), {
            music: data.music || '',
            title: data.title,
            uid: auth.currentUser.uid,
            createdAt: Timestamp.fromDate(new Date()),
        })

        setData({
            music: {},
            title: '',
            uid: auth.currentUser.uid
        })

    }

    useEffect(() => {
        let unsub = null
        unsub = onSnapshot(query(collection(db, "music"), orderBy('createdAt')), (querySnapshot) => {
            const posts = [];
            querySnapshot.forEach((doc) => {
                posts.unshift(doc.data());
            });
            setMusics(posts)
        });
        return () => unsub()
    }, [])

    return (
        <>
            <main className="background">
                <section className='music-container'>
                    <section className='music-tools'>
                        <nav className='music-nav'>
                            <span className={`music-nav_item `}>All music</span>
                            <span className={`music-nav_item `}>My music</span>
                        </nav>
                        {
                            open ?
                                <img
                                    className='music-add'
                                    onClick={() => openPostHandler()}
                                    src={newPost}
                                    alt="pencil"/>
                                :
                                <img  className='music-add'
                                      onClick={() => openPostHandler()}
                                      src={check}
                                      alt="check"/>
                        }
                    </section>
                    <section className='player'>
                        <section className='player-tools'>
                            <Slider onChange={onChange} percentage={percentage}/>
                            <section className='player-info-track'>
                                <span className='player-start-span'>{secondsToHms(currentTime)}</span>
                                <span className='player-end-span'>{secondsToHms(duration)}</span>
                            </section>
                        </section>

                        {
                            !isPlaying ? <img onClick={() => {startMusic()}} className='player-start-btn' src={play} alt="play"/> : <img onClick={() => {startMusic()}} className='player-start-btn' src={pause} alt="pause"/>
                        }

                        {
                            selectMusic.nameMusic ? <audio ref={audioRef}
                                                       src={selectMusic.nameMusic}
                                                       onLoadedData={(e) => {
                                                           setDuration(e.currentTarget.duration.toFixed(2))
                                                       }}
                                                       onTimeUpdate={(e) => getCurrDuration(e)}
                            ></audio> : null
                        }
                    </section>
                    {
                        !open ? (
                            <section className="addmusic">
                                <input onChange={(e) => setData({...data, music: e.target.files[0]})}  id='addmusic-2' className='btn file-btn' type='file'/>
                                <label className="field__file" htmlFor="addmusic-2">
                                    <img className="addmusic-upload" src={music}  alt="music"/>
                                    {
                                        data.music ? <span className='addmusic-name'>{data.music.name}</span> : null
                                    }

                                </label>
                                <label className='addmusic-title' htmlFor="title">
                                    <span className='title-span'>Title:</span>
                                    <input onChange={(e) => setData({...data, title: e.target.value})} value={data.title} className='title-input' id='title' type="text"/>
                                </label>
                                <section className='btn-container'>
                                    <span className='error'>{error}</span>
                                    <button onClick={() => sendMusicHandler()} className='btn-send'>Send</button>
                                </section>
                            </section>
                        ) : null
                    }
                    <section className="music-list">
                        {
                            musics.map(e => {
                                return <MusicItem data={e} isPlaying={isPlaying} setIsPlaying={setIsPlaying} startMusic={startMusic} selectMusic={selectMusic} setSelectMusic={setSelectMusic} />
                            })
                        }

                    </section>
                </section>
                <Github />
            </main>
        </>
    );
};

export default Music;
