import React, { useState, useEffect } from 'react'


export default ({url}) => {
  const [ text, setText ] = useState("")

  useEffect(async () => {
    const response = await fetch(url)
    const text = await response.text()
    setText(text)
  });
  return (
    <div>
      <div>----------</div>
      <p>{text}</p>
      <div>----------</div>
    </div>
  )
}
