//댓글 작성 시간
export default function timeForToday(value) {
    const today = new Date();
    const timeValue = new Date(value);
    const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
    //초
    if (betweenTime < 1) {
        let result = "";
        if(today.getSeconds() < timeValue.getSeconds()) {
            let parentSeconds = today.getSeconds() + 60
            result = parentSeconds - timeValue.getSeconds()
            return `${result}초 전`
        } else {
            result = today.getSeconds() - timeValue.getSeconds()
            return `${result}초 전`
        }
    }
    //분
    if (betweenTime < 60) {
        return `${betweenTime}분전`;
    }
    //시
    const betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) {
        return `${betweenTimeHour}시간전`;
    }
    //일
    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay < 365) {
        return `${betweenTimeDay}일전`;
    }

    return `${Math.floor(betweenTimeDay / 365)}년전`;
}