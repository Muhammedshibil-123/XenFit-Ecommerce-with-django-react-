import React from 'react'

function About() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        textAlign: "center",
        flexDirection: "column",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
        fontSize: "18px"
      }}
    >
      <h1>About Us</h1>
      <p>
        Welcome to <strong>Bassify</strong>, the home of premium sound.
        We believe that great sound is more than just listening—it’s an
        experience. That’s why we focus only on audio products, from powerful
        headphones and wireless earbuds to smart speakers and sound accessories.
      </p>
      <p>
        Our mission is simple: to bring you closer to the music, movies, and
        moments you love through crystal-clear, immersive sound. Whether you’re
        a casual listener, a music lover, or a hardcore audiophile, we’ve got
        something that matches your vibe.
      </p>
      <p>
        At <strong>Bassify</strong>, we handpick every product with
        one goal in mind—delivering the best sound quality at the best value.
        Because when sound is pure, life feels better.
      </p>
      <h2>🎧 Hear the difference. Feel the music. Live the sound.</h2>
    </div>
  )
}

export default About
