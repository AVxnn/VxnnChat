import React from 'react';
import Header from "../../widgets/header/header";
import block from '../../img/block.png'
import './style.css'
import Button from "../../shared/button/button";
import {getAuth} from "firebase/auth";
import Github from "../../features/github/github";

const Main = () => {

    const auth = getAuth().currentUser

    return (
        <>
            <main className="background">
                <Header />
                <section className="main">
                    <img className="main_img" src={block} alt="obloko"/>
                    <section className="section-content">
                        <h2 className="content-title">Общий чат</h2>
                        <p className="content-description">В данной версии возможны баги. Если нашли ошибку напишите мне в телеграм <a href='https://t.me/romashkog' target='_blank' className="telegram">@romashkog</a> буду благодарен!</p>
                        {!auth ? <Button text={'Зарегистрироваться'} url={'register'}/> : <Button text={'Перейти в чат'} url={'chat'}/>}
                    </section>
                </section>
                <Github />
            </main>

        </>
    );
};

export default Main;
