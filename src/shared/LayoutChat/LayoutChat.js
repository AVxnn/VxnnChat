import React, {useEffect, useState} from 'react';
import MobileChat from "../../pages/MobileChat/mobileChat";
import Chat from "../../pages/chat/chat";

const LayoutChat = () => {
  const [width, setWidth] = useState(window.innerWidth < 768 ? false : true)

  useEffect(() => {
    window.addEventListener("resize", (value) => {
      if (value.currentTarget.window.innerWidth < 768) {
        setWidth(false)
        console.log(width)

      } else {
        setWidth(true)
        console.log(width)

      }
    });
  }, [])

  return (
    <>
      {
        width ? <Chat width={width}/> : <MobileChat width={width}/>
      }
    </>
  )
};

export default LayoutChat;
