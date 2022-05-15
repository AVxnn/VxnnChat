import React from 'react';
import Header from "../../widgets/header/header";
import block from '../../img/block.png'
import './style.css'
import Button from "../../shared/button/button";

const Main = () => {
    return (
        <>
            <main className="background">
                <Header />
                <section className="main">
                    <img className="main_img" src={block} alt="obloko"/>
                    <section className="section-content">
                        <h2 className="content-title">Общий чат</h2>
                        <p className="content-description">В данной версии возможны баги. Если нашли ошибку напишите мне в телеграм <a href='https://t.me/romashkog' target='_blank' className="telegram">@romashkog</a> буду благодарен!</p>
                        <Button text={'Зарегистрироваться'} url={'auth'}/>
                    </section>
                </section>
            </main>
        </>
    );
};

export default Main;
