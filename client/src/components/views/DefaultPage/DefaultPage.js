import React from 'react'
import { Carousel} from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { BrowserRouter as Link } from "react-router-dom";
import '../../App.css';
import './Sections/Footer.css';

function DefaultPage(props) {
    return (
        <div>
            <Carousel autoplay>
                <div class="img1">
                    <div class="content">
                        <h1 style={{color:"dimgray"}}>Welcome!</h1>
                        
                        <h3 style={{color:"darkslategray"}}>
                            <strong>
                                'Noh : C'는 <br/>쇼핑과 영상을<br/>함께<br/>즐길 수 있어요!
                            </strong>
                        </h3>

                    </div>
                    <div class="img-cover">
                    </div>
                </div>
                <div class="img2">
                    <Link to="Shop">
                        <div class="content">
                            <h1 style={{color:"darkslategray"}}><strong>Go to <br/>Shopping</strong> <SmileOutlined /></h1>
                        </div>
                        <div class="img-cover">
                        </div>
                    </Link>
                </div>
                <div class="img3">
                    <Link to="Mytube">
                        <div class="content">
                            <h1 style={{color:"black"}}><strong>20 F/W, 21 S/S<br/>Lookbook Video!</strong></h1>
                        </div>
                        <div class="img-cover">
                        </div>
                    </Link>
                </div>
            </Carousel>
            
        {/* Footer */}
        <div class="footer" style={{padding:"20px"}}>
            <div class="outer-margin">
                <div class="footer-info">
                    <div class="footer-helpdesk">
                        <h3 class="desk-number">010 0000 0000</h3>
                        <div class="desk-info">
                            문자 메세지 수신불가 / 카톡 상담, Q & A 게시판 이용<br />
                            10:00 AM ~ 4:00 PM (Lunch time 12:00 PM ~ 1:00 PM)<br />
                            토,일요일 및 공휴일 휴무
                        </div>
                        <div class="desk-links">
                            <a href="#"><strong>개인정보취급방침</strong></a>
                            <a href="#">약관</a>
                            <a href="#">자주묻는질문</a>
                            <a href="#">문의게시판</a>
                        </div>
                    </div>
                    <div class="footer-menu">
                        <div class="item account">
                            <div class="title">My Account</div>
                            <ul>
                            <li><a href="#">마이페이지</a></li>
                            <li><a href="#">주문내역</a></li>
                            <li><a href="#">회원등급 및 혜택</a></li>
                            </ul>
                        </div>
                        <div class="item shipping-returns">
                            <div class="title">Shipping & Returns</div>
                            <ul>
                            <li><a href="#">문의게시판</a></li>
                            <li><a href="#">교환반품안내</a></li>
                            <li><a href="#" target="_blank">우체국택배 반품접수</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="corp-info">
                    <ul>
                        <li>상호: Noh:C </li>
                        <li>대표: 노승환</li>
                        <li></li>
                        <li>사업자등록번호: <a href="#" target="_blank">000-00-00000</a></li>
                        <li>통신판매업신고번호: 제2021-성남분당-0000호 </li>
                        <li>개인정보담당자: 최지웅 <a href="#"> nohc@gmail.com</a></li>
                    </ul>
                    <ul>
                        <li>반품주소: 13630 경기도 성남시 분당구 구미동 7-2 (그린컴퓨터아카데미 성남분당점)</li>
                        <li>입금계좌: KR한국은행 000000-00-0000000 최지웅</li>
                    </ul>
                </div>
                <div class="copyright">
                    &copy; 2021 Noh:C, Inc. All rights reserved.
                </div>
            </div>
            {/* outer-margin End. */}
        </div>
        {/* Footer End. */}
    </div>
    )
}

export default DefaultPage
