const { Circle, Bar } = require('../src/index');

const [,, target = 'Circle'] = process.argv;

if (target === 'circle') {
    const circle = new Circle('loading');
    circle.start();
} else {
    const bar = new Bar();
    bar.start();
}

