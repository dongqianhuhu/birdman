const shelljs = require('shelljs/global');
const { EventEmitter } = require('events');

class Animation extends EventEmitter {
    constructor() {
        super();
        this.animation = true;
        this.style_033 = '\u001b';
        this.style_erase = this.style_033 + '[0m';
        this.cursor_delete = '\b';
        this.cursor_hide = this.style_033 + '[?25l';
        this.cursor_save = this.style_033 + '[s';
        this.cursor_resume = this.style_033 + '[u';
        this.startTime = +new Date();
        this.once('end', cb => {
            this.animation = false;
            this.endTime = +new Date();
            this.duration = this.endTime - this.startTime;
            echo('\t' + this.duration + ' ms');
            cb();
        });
    }
}

class Circle extends Animation {
    constructor(content, slides = ['\u25E4', '\u25E5', '\u25E2', '\u25E3'], speed = 0.05) {
        super();
        this.content = ' ' + content;
        this.slides = slides;
        this.slidesLength = this.slides.length;
        this.speed = speed;
        this.color = this.style_033 + '[36m'
        this.head = this.cursor_resume + this.cursor_delete + this.cursor_hide + this.color;
        this.rear = this.style_erase;
        this.frames = this.framesGen();
    }
    start() {
        let node = this.frames;
        echo('-en', ' ' + this.cursor_save);
        while (node.next && this.animation) {
            // this.content += '.';
            echo('-en', this.head + node.frame + this.cursor_save + this.rear + this.content);
            node = node.next;
            this.sleep();
            // if (n === 10) this.end(() => { console.log('end'); });
        }
    }
    sleep() {
        exec('sleep ' + this.speed);
    };
    end(cb) {
        this.emit('end', cb);
    }
    framesGen() {
        const slides = this.slides;
        let head, pre, now = null;
        for (let i = 0; i < slides.length; i++) {
            now = {
                frame: slides[i],
                next: null,
            };
            if (i === 0) head = now;
            if (pre) pre.next = now;
            pre = now;
        }
        pre.next = head;
        return head;
    }
}

class Bar extends Animation {
    constructor(block = '\u25B6 ', speed = 0.5) {
        super();
        this.block = block;
        this.speed = speed;
        this.color = this.style_033 + '[36m';
        this.head = this.cursor_hide + this.color;
        this.rear = this.style_erase;
    }
    start() {
        let n = 0;
        while(++n) {
            echo('-en', this.head + this.block + this.rear);
            this.sleep();
        }
    }
    sleep() {
        exec('sleep ' + this.speed);
    }
}

if (!module.parent) {
    const circle = new Circle('loading');
    circle.start();
}