import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";

//기본
import DefaultPage from './views/DefaultPage/DefaultPage';

// 기타 레이아웃
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer"

// 쇼핑몰 프로젝트 관련 페이지
import ShopLandingPage from "./views/ShopLandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import UploadProductPage from "./views/UploadProductPage/UploadProductPage.js";
import DetailProductPage from "./views/DetailProductPage/DetailProductPage";
import CartPage from './views/CartPage/CartPage';
import HistoryPage from './views/HistoryPage/HistoryPage';

// x튜브 프로젝트 관련 페이지
import UploadVideoPage from './views/UploadVideoPage/UploadVideoPage';
import MyTubePage from './views/MyTubeLandingPage/LandingPage';
import DetailVideoPage from './views/DetailVideoPage/DetailVideoPage';
import SubscriptionPage from './views/SubscriptionPage/SubscriptionPage';
//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          {/* 기본 */}
          <Route exact path="/" component={Auth(DefaultPage, null)} />

          {/* 쇼핑몰 관련 라우팅 */}
          <Route exact path="/Shop" component={Auth(ShopLandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/product/upload" component={Auth(UploadProductPage, true)} />
          <Route exact path="/product/:productId" component={Auth(DetailProductPage, null)} />
          <Route exact path="/user/cart" component={Auth(CartPage, true)} />
          <Route exact path="/history" component={Auth(HistoryPage, true)} />

          {/* x튜브 관련 라우팅 */}
          <Route exact path="/video/upload" component={Auth(UploadVideoPage, true)} />
          <Route exact path="/MyTube" component={Auth(MyTubePage, null)} />
          <Route exact path="/video/:videoId" component={Auth(DetailVideoPage, null)} />
          <Route exact path="/subscription" component={Auth(SubscriptionPage, true)} />
          
        </Switch>
      </div>
    </Suspense>
  );
}

export default App;
