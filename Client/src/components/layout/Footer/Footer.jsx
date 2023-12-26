import React from 'react'
import playStore from '../../../images/playstore.png'
import appStore from '../../../images/Appstore.png'
import './Footer.css'

const Footer = () => {
    return (
        <footer style={{ marginTop: "10vmax" }} className='bg-dark text-light'>
            <div style={{ padding: "2vmax 0" }} className='row col-10 offset-1 text-center align-items-center'>
                {/* Left Footer */}
                <section className='col-md-3'>
                    <h4 style={{ fontSize: "1.7vmax", marginBottom: "1vmax" }}>DOWNLOAD OUR APP</h4>
                    <p style={{ fontSize: "1.2vmax", marginBottom: "1.4vmax" }}>Download App For Android and IOS mobile phone</p>
                    <img style={{ width: "12vmax", cursor: "pointer", marginBottom: "1.4vmax" }} src={playStore} alt='playStore' /> <br />
                    <img style={{ width: "12vmax", cursor: "pointer" }} className='' src={appStore} alt='appStore' />
                </section >
                {/* Mid Footer */}
                <section className='col-md-6'>
                    <h1 style={{ fontSize: "4.5vmax", margin: "1.4vmax 0" }} className='text-danger display-6'>E-COMMERCE</h1>
                    <p style={{ fontSize: "0.8vmax" }}>High Quality is Our First Priority</p>
                    <p style={{ fontSize: "0.8vmax" }}>Copyrights 2023 &copy; MuhammadTashfeen</p>
                </section>
                {/* Right Footer */}
                <section className='col-md-3'>
                    <h4 style={{ fontSize: "1.5vmax", marginBottom: "1.5vmax" }} className='text-decoration-underline' > Follow Us </h4>
                    <a style={{ fontSize: "1.2vmax", marginBottom: "1vmax" }} className='d-block text-decoration-none a-custom-hover' href='https://www.linkedin.com/feed/'>Instagram</a>
                    <a style={{ fontSize: "1.2vmax", marginBottom: "1vmax" }} className='d-block text-decoration-none a-custom-hover' href='https://www.linkedin.com/feed/'>FaceBook</a>
                    <a style={{ fontSize: "1.2vmax" }} className='d-block text-decoration-none a-custom-hover' href='https://www.linkedin.com/feed/'>YouTube</a>
                </section>
            </div>
        </footer >
    )
}

export default Footer