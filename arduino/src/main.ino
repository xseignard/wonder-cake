#include <SPI.h>
#include <Ethernet.h>
#include <EthernetUdp.h>
#include <DMD.h>
#include <TimerOne.h>
#include <Arial_Black_16_ISO_8859_1.h>

// DMD stuff
#define DISPLAYS_ACROSS 5
#define DISPLAYS_DOWN 1
#define RED 0xFF
#define BLACK 0
#define DISPLAYS_BPP 1
DMD dmd(DISPLAYS_ACROSS, DISPLAYS_DOWN, DISPLAYS_BPP);

// Ethernet/UDP stuff
// define a new size of max bytes of udp message
#define UDP_TX_PACKET_MAX_SIZE 200

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
IPAddress ip(192, 168, 1, 2);

unsigned int localPort = 8888;
char packetBuffer[UDP_TX_PACKET_MAX_SIZE];
char currentText[UDP_TX_PACKET_MAX_SIZE];
EthernetUDP Udp;

// timing stuff
// default interval for scrolling speed (in ms)
long interval = 30;
// last time check
long last;
// flag to check whether a marquee is ended or not
boolean marqueeEnd = false;
// width of the display
int width = 32*DISPLAYS_ACROSS;
// x offset where marquee starts
int xStartMarquee = width - 1;

void setup() {
	Ethernet.begin(mac, ip);
	Udp.begin(localPort);
	Timer1.initialize(2000);
	Timer1.attachInterrupt(ScanDMD);
	dmd.selectFont(Arial_Black_16_ISO_8859_1);
	// blink display to notify readiness
	blinkDisplay();
	delay(1000);
}

void blinkDisplay() {
	dmd.clearScreen(RED);
	delay(500);
	dmd.clearScreen(BLACK);
	delay(500);
	dmd.clearScreen(RED);
	delay(500);
	dmd.clearScreen(BLACK);
}

void loop() {
	// handle incoming messages
	int packetSize = Udp.parsePacket();
	if (packetSize) {
		// clear previous things stored in the buffer
		memset(packetBuffer, 0, sizeof(packetBuffer));
		Udp.read(packetBuffer, UDP_TX_PACKET_MAX_SIZE);
		handlePacket(packetBuffer);
	}
	// scroll the marque
	moveText();
}

void handlePacket(char* text) {
	// if char starts with a #, it's an "adjust interval" message
	if (text[0] == '#') {
		// reconstruct the new interval to apply
		char tmp[] = {text[1], text[2], text[3], text[4]};
		// from millis to micros
		interval = atol(tmp);
	}
	// else a text to display
	else {
		strncpy(currentText, text, sizeof(currentText));
		width = 32*DISPLAYS_ACROSS;
		dmd.clearScreen(BLACK);
		dmd.drawMarquee(currentText, strlen(currentText), xStartMarquee, 0, RED, BLACK);
		if (marqueeEnd) marqueeEnd = false;
		last = millis();
	}
}

void moveText() {
	long timer = millis();
	if(timer - last > interval && !marqueeEnd) {
		last = timer;
		marqueeEnd = dmd.stepMarquee(-1,0);
		if (marqueeEnd) {
			width = 32*DISPLAYS_ACROSS;
			dmd.clearScreen(BLACK);
			dmd.drawMarquee(currentText, strlen(currentText), xStartMarquee, 0, RED, BLACK);
			marqueeEnd = false;
		}
	}
}

void ScanDMD() {
	dmd.scanDisplayBySPI();
}
