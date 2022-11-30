var tl = new TimelineMax();
var bgd = $('#background rect');
var table = $('#table_legs, #table');
var lampLeg = $('#lamp > .lamp-leg');
var lampbt = $('#lamp-bottom');
var lampLight = $('#lamp > .light');
var lampLine = $('#lamp-line');
var lampLineB = $('#lamp-line-b');
var lampLineT = $('#lamp-line-t');
var lampCircle = $('#lamp-circle');
var lampHead = $('#lamp-head');
var lampHeader = $('#lamp-header');
var lampBody = $('#lamp-body');
var computer = $('#computer > *');
var keyboard = $('#keyboard > *');
var asset = $('#computer_mouse > * , #coffee_mug > *');
let meTl, dizzy, blink;

tl.from(bgd, 0.2, { opacity: 0, scale: 0, transformOrigin: 'center center' })
	.staggerFrom(table, 0.2, { y: "-=200", opacity: 0, ease: Elastic.easeOut }, 0.1)
	.from(lampLeg, 0.2, { opacity: 0, x: "-200", ease: Elastic.easeOut })
	.from(lampbt, 0.2, { opacity: 0, scale: 0, transformOrigin: 'center center' })
	.from(lampLineB, 0.3, { opacity: 0, transformOrigin: '100% 100%', rotation: '-180deg' })
	.from(lampCircle, 0.1, { opacity: 0, x: '-=100', y: '-=100' })
	.from(lampLineT, 0.3, { opacity: 0, transformOrigin: '0% 100%', rotation: '-180deg' })
	.from(lampHead, 0.2, { opacity: 0, scale: 0, ease: Elastic.easeOut })
	.from(lampHeader, 0.5, { transformOrigin: '60% 60%', rotation: '60deg' })
	.from(lampBody, 0.5, { transformOrigin: '70% 70%', rotation: '-25deg' })
	.staggerFrom(computer, 1, { opacity: 0, scale: 0, transformOrigin: 'center center', ease: Back.easeOut }, 0.2)
	.staggerFrom(keyboard, 0.5, { opacity: 0, y: '-=100', ease: Linear.easeInOut }, 0.05)
	.staggerFrom(asset, 0.5, { opacity: 0 }, 0.05)
	.to(lampLight, 0.2, { opacity: 0.8, ease: Elastic.easeOut, delay: 0.5 }, "a")
	.to(lampLight, 0.1, { opacity: 0 }, "b")
	.to(lampLight, 0.1, { opacity: 0.2 }, "c")
	.to(bgd, 0.2, { opacity: 0.1, delay: 0.5 }, "a-=0.05")
	.to(bgd, 0.1, { opacity: 1 }, "b-=0.05")
	.to(bgd, 0.1, { opacity: 0.5 }, "c-=0.05")
	.to(bgd, 0.2, { opacity: 1, fill: 'rgb(255 240 0)' })
	.to('#wave', 0.1, { opacity: 1, fill: 'rgb(255 240 0)' })
	.fromTo(lampLine, 0.2, { opacity: 0 }, { opacity: 0.2, delay: 0.5 }, "a-=0.05")
	.to(lampLine, 0.1, { opacity: 1 }, "b-=0.05")
	.to(lampLine, 0.1, { opacity: 0.5 }, "c-=0.05")
	.staggerFrom("#name", 1.5, { opacity: 0, transformOrigin: 'center center', ease: Back.easeOut }, 0.6)
	.to('#screen', 0.2, { opacity: 1, fill: '#F8F8F8' })


function select(element) {
	$(element).addClass('checked');
	$(element).prevAll().removeClass('checked');
	$(element).nextAll().removeClass('checked');
}

// mouse coords stuff

let xPosition;
let yPosition;

let height;
let width;

function percentage(partialValue, totalValue) {
	return (100 * partialValue) / totalValue;
}

let dizzyIsPlaying;
function updateScreenCoords(event) {
	if (!dizzyIsPlaying) {
		xPosition = event.clientX;
		yPosition = event.clientY;
	}
	if (!dizzyIsPlaying && Math.abs(event.movementX) > 500) {
		dizzyIsPlaying = true;
		dizzy.restart();
	}
}

let storedXPosition = 0;
let storedYPosition = 0;

// gsap can use queryselector in the quick setter but this is better for performance as it touches the DOM less
const dom = {
	face: document.querySelector(".face"),
	eye: document.querySelectorAll(".eye"),
	innerFace: document.querySelector(".inner-face"),
	hairFront: document.querySelector(".hair-front"),
	hairBack: document.querySelector(".hair-back"),
	shadow: document.querySelectorAll(".shadow"),
	ear: document.querySelectorAll(".ear"),
	eyebrowLeft: document.querySelector(".eyebrow-left"),
	eyebrowRight: document.querySelector(".eyebrow-right")
};

function animateFace() {
	if (!xPosition) return;
	// important, only recalculating if the value changes
	if (storedXPosition === xPosition && storedYPosition === yPosition) return;

	// range from -50 to 50
	x = percentage(xPosition, width) - 50;
	y = percentage(yPosition, height) - 50;

	// range from -20 to 80
	yHigh = percentage(yPosition, height) - 20;
	// range from -80 to 20
	yLow = percentage(yPosition, height) - 80;

	gsap.to(dom.face, {
		yPercent: yLow / 30,
		xPercent: x / 30
	});
	gsap.to(dom.eye, {
		yPercent: yHigh / 3,
		xPercent: x / 2
	});
	gsap.to(dom.innerFace, {
		yPercent: y / 6,
		xPercent: x / 8
	});
	gsap.to(dom.hairFront, {
		yPercent: yHigh / 15,
		xPercent: x / 22
	});
	gsap.to([dom.hairBack, dom.shadow], {
		yPercent: (yLow / 20) * -1,
		xPercent: (x / 20) * -1
	});
	gsap.to(dom.ear, {
		yPercent: (y / 1.5) * -1,
		xPercent: (x / 10) * -1
	});
	gsap.to([dom.eyebrowLeft, dom.eyebrowRight], {
		yPercent: y * 2.5
	});

	storedXPosition = xPosition;
	storedYPosition = yPosition;
}

// function being called at the end of main timeline
function addMouseEvent() {
	const safeToAnimate = window.matchMedia(
		"(prefers-reduced-motion: no-preference)"
	).matches;

	if (safeToAnimate) {
		window.addEventListener("mousemove", updateScreenCoords);

		// gsap's RAF, falls back to set timeout
		gsap.ticker.add(animateFace);

		blink.play();
	}
}

// update if browser resizes
function updateWindowSize() {
	height = window.innerHeight;
	width = window.innerWidth;
}
updateWindowSize();
window.addEventListener("resize", updateWindowSize);

// timeline
var items = document.querySelectorAll(".timeline li");

function isElementInViewport(el) {
	var rect = el.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}

function callbackFunc() {
	for (var i = 0; i < items.length; i++) {
		if (isElementInViewport(items[i])) {
			if (!items[i].classList.contains("in-view")) {
				items[i].classList.add("in-view");
			}
		} else if (items[i].classList.contains("in-view")) {
			items[i].classList.remove("in-view");
		}
	}
	if (isElementInViewport(document.getElementById('img'))) {

	}
}

window.addEventListener("load", callbackFunc);
window.addEventListener("scroll", callbackFunc);

var observer = new IntersectionObserver(function (entries) {
	if (entries[0].isIntersecting === true) {
		console.log('Element is fully visible in screen');
		l.reversed(!l.reversed());
	}
	else {
		console.log('Element is not visible in screen');
		l.reversed(true);
	}
}, { threshold: [0] });

observer.observe(document.querySelector("#intro"));

var l = new TimelineMax();
l.from('#intro', 0.1, { opacity: 0, scale: 0, transformOrigin: 'center center' })
	.from("#me", 1, { duration: 0.75, y: 150, autoAlpha: 0, ease: Power3.out, stagger: 1.5 })
	.from('#img', 1, { opacity: 0, x: "-200", ease: Elastic.easeOut })
	.then(function () {
		meTl = gsap.timeline({
			onComplete: addMouseEvent,
		})

		gsap.set(".bg", { transformOrigin: "50% 50%" });
		gsap.set(".ear-right", { transformOrigin: "0% 50%" });
		gsap.set(".ear-left", { transformOrigin: "100% 50%" });
		gsap.set(".me", { opacity: 1 });

		meTl
			.from(
				".me",
				{
					duration: 1,
					yPercent: 100,
					ease: "elastic.out(0.5, 0.4)"
				},
				0.5
			)
			.from(
				".head , .hair , .shadow",
				{
					duration: 0.9,
					yPercent: 20,
					ease: "elastic.out(0.58, 0.25)"
				},
				0.6
			)
			.from(
				".ear-right",
				{
					duration: 1,
					rotate: 40,
					yPercent: 10,
					ease: "elastic.out(0.5, 0.2)"
				},
				0.7
			)
			.from(
				".ear-left",
				{
					duration: 1,
					rotate: -40,
					yPercent: 10,
					ease: "elastic.out(0.5, 0.2)"
				},
				0.7
			)
			.to(
				".glasses",
				{
					duration: 1,
					keyframes: [{ yPercent: -10 }, { yPercent: -0 }],
					ease: "elastic.out(0.5, 0.2)"
				},
				0.75
			)
			.from(
				".eyebrow-right , .eyebrow-left",
				{
					duration: 1,
					yPercent: 300,
					ease: "elastic.out(0.5, 0.2)"
				},
				0.7
			)
			.to(
				".eye-right , .eye-left",
				{
					duration: 0.01,
					opacity: 1
				},
				0.85
			)
			.to(
				".eye-right-2 , .eye-left-2",
				{
					duration: 0.01,
					opacity: 0
				},
				0.85
			);

		blink = gsap.timeline({
			repeat: -1,
			repeatDelay: 5,
			paused: true
		});

		blink
			.to(
				".eye-right, .eye-left",
				{
					duration: 0.01,
					opacity: 0
				},
				0
			)
			.to(
				".eye-right-2, .eye-left-2",
				{
					duration: 0.01,
					opacity: 1
				},
				0
			)
			.to(
				".eye-right, .eye-left",
				{
					duration: 0.01,
					opacity: 1
				},
				0.15
			)
			.to(
				".eye-right-2 , .eye-left-2",
				{
					duration: 0.01,
					opacity: 0
				},
				0.15
			);

		dizzy = gsap.timeline({
			paused: true,
			onComplete: () => {
				dizzyIsPlaying = false;
			}
		});

		dizzy
			.to(
				".eyes",
				{
					duration: 0.01,
					opacity: 0
				},
				0
			)
			.to(
				".dizzy",
				{
					duration: 0.01,
					opacity: 0.3
				},
				0
			)
			.to(
				".mouth",
				{
					duration: 0.01,
					opacity: 0
				},
				0
			)
			.to(
				".oh",
				{
					duration: 0.01,
					opacity: 0.85
				},
				0
			)
			.to(
				".head, .hair-back, .shadow",
				{
					duration: 6,
					rotate: 2,
					transformOrigin: "50% 50%",
					ease: "myWiggle"
				},
				0
			)
			.to(
				".me",
				{
					duration: 6,
					rotate: -2,
					transformOrigin: "50% 100%",
					ease: "myWiggle"
				},
				0
			)
			.to(
				".me",
				{
					duration: 4,
					scale: 0.99,
					transformOrigin: "50% 100%",
					ease: "lessWiggle"
				},
				0
			)
			.to(
				".dizzy-1",
				{
					rotate: -360,
					duration: 1,
					repeat: 5,
					transformOrigin: "50% 50%",
					ease: "none"
				},
				0.01
			)
			.to(
				".dizzy-2",
				{
					rotate: 360,
					duration: 1,
					repeat: 5,
					transformOrigin: "50% 50%",
					ease: "none"
				},
				0.01
			)
			.to(
				".eyes",
				{
					duration: 0.01,
					opacity: 1
				},
				4
			)
			.to(
				".dizzy",
				{
					duration: 0.01,
					opacity: 0
				},
				4
			)
			.to(
				".oh",
				{
					duration: 0.01,
					opacity: 0
				},
				4
			)
			.to(
				".mouth",
				{
					duration: 0.01,
					opacity: 1
				},
				4
			);

		// end animation
	});
l.reversed(true);

const boxes = document.querySelectorAll('.box');
const skill = new TimelineMax();

var observeSkill = new IntersectionObserver(function (entries, self) {
	entries.forEach(entry => {
		if (entry.isIntersecting === true) {
			skill.to(entry.target, 0.2, { opacity: 1 });
		}
		else {
			skill.to(entry.target, 0.1, { opacity: 0 });
		}

	});
}, { threshold: [0.5] });

boxes.forEach(box => {
	observeSkill.observe(box);
});

const projects = document.querySelectorAll('.card-wrap');
const p = new TimelineMax();

var observeProject = new IntersectionObserver(function (entries, self) {
	entries.forEach(entry => {
		if (entry.isIntersecting === true) {
			p.to(entry.target, 0.2, { opacity: 1 });
		}
		else {
			p.to(entry.target, 0.1, { opacity: 0 });
		}

	});
}, { threshold: [0.5] });

projects.forEach(project => {
	observeProject.observe(project);
});

$(document).ready(function () {
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			$('#scroll').fadeIn();
		} else {
			$('#scroll').fadeOut();
		}
	});
	$('#scroll').click(function () {
		$("html, body").animate({ scrollTop: 0 }, 100);
		return false;
	});
});

var cursor = $(".cursor"),
	follower = $(".cursor-follower");

var posX = 0,
	posY = 0;

var mouseX = 0,
	mouseY = 0;

TweenMax.to({}, 0.016, {
	repeat: -1,
	onRepeat: function () {
		posX += (mouseX - posX) / 9;
		posY += (mouseY - posY) / 9;

		TweenMax.set(follower, {
			css: {
				left: posX - 12,
				top: posY - 12
			}
		});

		TweenMax.set(cursor, {
			css: {
				left: mouseX,
				top: mouseY
			}
		});
	}
});

$(document).on("mousemove", function (e) {
	mouseX = e.clientX;
	mouseY = e.clientY;
});

let projectCard = document.querySelectorAll('.card-wrap');

projectCard.forEach(card => {
	card.addEventListener('mouseover', () => {
		if (!(card.id == 'ncms' || card.id == 'nchannels' || card.id == 'ncourses')) {
			cursor.addClass('view');
			cursor.removeClass('cs');
			follower.hide();
		}
		if ((card.id == 'ncms' || card.id == 'nchannels' || card.id == 'ncourses')) {
			cursor.addClass('cs');
			cursor.removeClass('view');
			follower.hide();
		}
	});
	card.addEventListener('mouseout', () => {
		cursor.removeClass('view');
		cursor.removeClass('cs');
		follower.show();
	});
});