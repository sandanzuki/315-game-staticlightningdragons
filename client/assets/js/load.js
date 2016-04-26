var wait1, wait2, wait3, wait4,
    counter_waiter = 0;
    
var Load = {
    preload : function() {
        game.load.image('wait1', './assets/images/wait1.png');
        game.load.image('wait2', './assets/images/wait2.png');
        game.load.image('wait3', './assets/images/wait3.png');
        game.load.image('wait4', './assets/images/wait4.png');

        // align canvas
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    },

    create : function() {
        wait4 = this.add.sprite(0, 0, 'wait4'); // add background
        wait3 = this.add.sprite(0, 0, 'wait3'); // add background
        wait2 = this.add.sprite(0, 0, 'wait2'); // add background
        wait1 = this.add.sprite(0, 0, 'wait1'); // add background

        game.time.events.loop(Phaser.Timer.SECOND * 0.5, this.change_frame_wait, this);
    },

    change_frame_wait : function() {
        if(counter_waiter == 0)
            wait1.visible = !wait1.visible;
        if(counter_waiter == 1)
            wait2.visible = !wait2.visible;
        if(counter_waiter == 2)
            wait3.visible = !wait3.visible;
        if(counter_waiter == 3) {
            wait3.visible = !wait3.visible;
            wait2.visible = !wait2.visible;
            wait1.visible = !wait1.visible;
            counter_waiter = -1;
        }
        counter_waiter++;
    },
};