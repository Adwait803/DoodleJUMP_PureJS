document.addEventListener('DOMContentLoaded',() =>{
   const grid = document.querySelector('.grid')
   const doodler= document.createElement('div')
   let isGameOver = false
   let doodlerLeftSpace = 50
   let startPoint=150
   let doodlerBottomSpace =startPoint
   let platformCount =5
   let platforms=[]
   let score=0
   let isJumping=true
   let isGoingLeft=false
   let isGoingRight=false
   let leftTimerId
   let rightTimerId
   let upTimerId
   let downTimerId
   const gravity=0.9
   let speed= 3
   

   class Platform{
    constructor(newPlatBottom){
        this.left=Math.random() * 315
        this.bottom=newPlatBottom
        this.visual=document.createElement('div')

        const visual = this.visual
        visual.classList.add('platform')
        visual.style.left=this.left +'px'
        visual.style.bottom= this.bottom + 'px'
        grid.appendChild(visual)
    }
   }

   function createPlatform(){
    for (let i=0; i<platformCount;i++){
        let platGap = 550/platformCount
        let newPlatBottom=100+ i*platGap
        let newPlatform = new Platform(newPlatBottom)
        platforms.push(newPlatform)
        console.log(platforms)
    }
   }
   
   function movePlatform(){
    if (doodlerBottomSpace > 100){
        platforms.forEach(platform=>{
            platform.bottom -= 4
            let visual =platform.visual
            visual.style.bottom=platform.bottom +'px'

            if(platform.bottom<10){
                let firstPlatform=platforms[0].visual
                firstPlatform.classList.remove('platform')
                platforms.shift()
                console.log(platforms)
                score++
                let newPlatform = new Platform(550)
                platforms.push(newPlatform)
               
                

            }
        })
    }
   }

  
  

   function createDoodler(){
       grid.appendChild(doodler)
       doodler.classList.add('doodler')
       doodlerLeftSpace=platforms[0].left
       doodler.style.left=doodlerLeftSpace + 'px'
       doodler.style.bottom=doodlerBottomSpace + 'px'
    
   }
   
   function fall(){
    isJumping=false
    clearTimeout(upTimerId)
    downTimerId=setInterval(()=>{
        doodlerBottomSpace -=5
        doodler.style.bottom=doodlerBottomSpace +'px'
        if(doodlerBottomSpace<=0){
            gameOver()
        }
        platforms.forEach(platform=>{
            if(
                (doodlerBottomSpace>=platform.bottom)&& 
                (doodlerBottomSpace<=platform.bottom+15)&&
                ((doodlerLeftSpace+60)>=platform.left)&&
                (doodlerLeftSpace<=(platform.left+85))&&
                !isJumping
            ){
                startPoint=doodlerBottomSpace
                jump()
                isJumping=true
            }
        })
    },20)
   }
   

   function jump(){
         clearInterval(downTimerId)
         isJumping=true
         upTimerId=setInterval(()=>{
                doodlerBottomSpace +=20
                doodler.style.bottom=doodlerBottomSpace +'px'
                if(doodlerBottomSpace>startPoint+200){
                    fall()
                    isJumping=false
                }
            },40 )

   }
   
   function moveLeft(){
    if (isGoingRight){
        clearInterval (rightTimerId)
        isGoingRight=false
    }
    isGoingLeft=true
    leftTimerId=setInterval(()=>{
        if(doodlerLeftSpace>=0){
            console.log('going left')
            doodlerLeftSpace -=5
            doodler.style.left=doodlerLeftSpace +'px'
        }else moveRight()
    },20)
   }

   function moveRight(){
     if(isGoingLeft){
        clearInterval(leftTimerId)
        isGoingLeft=false
     }
        isGoingRight=true
        rightTimerId=setInterval(()=>{
            if(doodlerLeftSpace<=340){
                console.log('going right')
                doodlerLeftSpace +=5
                doodler.style.left=doodlerLeftSpace +'px'
            }else moveLeft()
        },20)   
   }

    function moveStraight(){
        isGoingLeft=false
        isGoingRight=false
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }


    function preventDefaultForArrowKeys(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        }
    }

    

    function debounce(func, delay) {
        let timerId;
        return function () {
          clearTimeout(timerId);
          timerId = setTimeout(() => {
            func.apply(this, arguments);
          }, delay);
        };
      }
      
     const leftButton = document.getElementById('leftButton');
    const rightButton = document.getElementById('rightButton');

    // Event listeners for left and right buttons
    leftButton.addEventListener('touchstart', () => {
        moveLeft();
    });

    leftButton.addEventListener('touchend', () => {
        moveStraight();
    });

    rightButton.addEventListener('touchstart', () => {
        moveRight();
    });

    rightButton.addEventListener('touchend', () => {
        moveStraight();
    });
    function control(e){

        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
          }
        if(e.key==='ArrowLeft'){
            moveLeft()
        }else if(e.key==='ArrowRight'){
            moveRight()
        }else if(e.key==='ArrowUp'){
            moveStraight()
        }
    }
   function gameOver(){
       isGameOver=true
       while(grid.firstChild){
           console.log('remove')
           grid.removeChild(grid.firstChild)
       }
       grid.innerHTML='Your score is ' +score
       clearInterval(upTimerId)
       clearInterval(downTimerId)
       clearInterval(leftTimerId)
       clearInterval(rightTimerId)
    }
   

   function start(){
    if(!isGameOver){
        createPlatform()
        createDoodler()
        setInterval(movePlatform,40)
        jump()
        document.addEventListener('keyup',control)
        document.addEventListener('keydown', preventDefaultForArrowKeys);
        document.addEventListener('keydown', debounce(preventDefaultForArrowKeys, 100));

    }
   }
  start()
   
})
