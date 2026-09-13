import React from 'react';

import Hero from './Hero';
import LeftSection from './LeftSection';
import RightSection from './RightSection';
import Universe from './Universe'; 

import Navbar from '../Navbar';
import Footer from '../Footer';

function ProductPage() {
    return (
        <>
            <Hero/>
            <LeftSection imageURL="media/images/kite.png" productName="kite" productDescription="Our ultra-fast flagship trading platform with streaming Market data, advanced charts, an elegant UI and more Enjoy the kite experience seamlessly on your Android and iOS devices" tryDemo="" learnMore="" googlePlay="" appStore=""/>
            <RightSection imageURL="media/images/console.png" productName="console" productDescription="The central dashboard for your Zerodha account. Gain insights into your trades and investments with in-depth reports and visualisation."learnMore=""/>
            <LeftSection imageURL="media/images/coin.png" productName="coin" productDescription="Buy direct mutual funds online, commission-free, delivered directly to your Demat account Enjoy the investment experience on your Android and iOS devices" tryDemo="" learnMore="" googlePlay="" appStore=""/>
            <RightSection imageURL="media/images/kiteconnect.png" productName="kite Connect API" productDescription="Build powerful trading platforms and experienceswith our super simple HTTP/JSON APIs. IF you are a startup, build your investment app ana showcase it to our clientbase." tryDemo="" learnMore=""/>
            <LeftSection imageURL="media/images/varsity.png" productName="varsity mobile" productDescription="An easy to grasp, collection of stock market lessons with in-depth coverage and illustrations. Content is broken down into bit-size cards to help you learn on the go." tryDemo="" learnMore="" googlePlay="" appStore=""/>
            <RightSection imageURL="media/images/kite.png" productName="varsity mobile" productDescription="An easy to grasp. collection of stock lessons with in-depth coverage and illustrations. content is broken down bite-size cards to help you learn on th go." tryDemo="" learnMore="" googlePlay="" appStore=""/>
            <p className="text-center mt-5 mb-5">
                Want to know about our techonology stack? Check out the Zerodha. tech blog.
            </p>
            <Universe/>
        </>
    ); 
}  

export default ProductPage; 