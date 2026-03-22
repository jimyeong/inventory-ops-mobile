import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

const MainSplash = () => {
    const glowAnim  = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.7)).current;
    const scanAnim  = useRef(new Animated.Value(0)).current;   // scan line
    const blinkAnim = useRef(new Animated.Value(1)).current;   // status dot blink

    useEffect(() => {
        // Box pop-in
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 6,
            tension: 80,
            useNativeDriver: true,
        }).start();

        // Glow pulse
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 1400,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 1400,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Scan line sweeping top → bottom of the box
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanAnim, {
                    toValue: 1,
                    duration: 1800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(scanAnim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Status dot blink
        Animated.loop(
            Animated.sequence([
                Animated.timing(blinkAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(blinkAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const beamOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.85] });
    const eyeOpacity  = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
    const boxGlow     = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });

    // Scan line travels 86px (box inner height)
    const scanTranslate = scanAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 86] });

    return (
        <View style={styles.container}>

            {/* ── Owl ── */}
            <View style={styles.owlWrapper}>
                <View style={styles.owlBody}>

                    {/* Ear tufts */}
                    <View style={styles.earsRow}>
                        <View style={styles.ear} />
                        <View style={styles.ear} />
                    </View>

                    {/* Eyes */}
                    <View style={styles.eyesRow}>
                        <Animated.View style={[styles.eye, { opacity: eyeOpacity }]}>
                            <View style={styles.pupil} />
                        </Animated.View>
                        <Animated.View style={[styles.eye, { opacity: eyeOpacity }]}>
                            <View style={styles.pupil} />
                        </Animated.View>
                    </View>

                    {/* Beak */}
                    <View style={styles.beak} />

                    {/* Wings */}
                    <View style={styles.wingsRow}>
                        <View style={styles.wing} />
                        <View style={styles.wing} />
                    </View>
                </View>

            </View>

            {/* ── Box being watched ── */}
            <Animated.View style={[styles.boxWrapper, { opacity: boxGlow, transform: [{ scale: scaleAnim }] }]}>

                {/* Surveillance corner brackets */}
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />

                <View style={styles.box}>
                    {/* Scan line sweeping over the box */}
                    <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanTranslate }] }]} />

                    <Text style={styles.boxIcon}>📦</Text>
                    <Text style={styles.boxLabel}>Owlverload</Text>
                </View>
            </Animated.View>

            {/* ── Status line ── */}
            <View style={styles.statusRow}>
                <Animated.View style={[styles.statusDot, { opacity: blinkAnim }]} />
                <Text style={styles.statusText}>MONITORING</Text>
            </View>

        </View>
    );
};

export default MainSplash;

const BOX_SIZE    = 110;
const BEAM_W      = 24;
const BEAM_H      = 100;
const CORNER_SIZE = 14;
const CORNER_W    = 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0d1117',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
    },

    /* ── Owl ── */
    owlWrapper: {
        alignItems: 'center',
    },
    owlBody: {
        width: 120,
        height: 130,
        backgroundColor: '#1e2a3a',
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#2c3e50',
        paddingTop: 8,
        shadowColor: '#f0c040',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 14,
        elevation: 6,
    },
    earsRow: {
        flexDirection: 'row',
        gap: 42,
        position: 'absolute',
        top: -16,
    },
    ear: {
        width: 18,
        height: 26,
        backgroundColor: '#1e2a3a',
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#2c3e50',
        transform: [{ rotate: '10deg' }],
    },
    eyesRow: {
        flexDirection: 'row',
        gap: 18,
        marginBottom: 6,
    },
    eye: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f0c040',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#f0c040',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 8,
    },
    pupil: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#0d1117',
    },
    beak: {
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 12,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#e67e22',
        marginTop: 2,
    },
    wingsRow: {
        flexDirection: 'row',
        gap: 60,
        position: 'absolute',
        bottom: 14,
    },
    wing: {
        width: 22,
        height: 30,
        backgroundColor: '#16213e',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#2c3e50',
    },

    /* ── Beams (converging inward toward the box) ── */
    beamsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: -4,
    },
    beam: {
        width: BEAM_W,
        height: BEAM_H,
        borderBottomLeftRadius: BEAM_W / 2,
        borderBottomRightRadius: BEAM_W / 2,
        shadowColor: '#f0c040',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 5,
    },
    beamLeft: {
        backgroundColor: '#f0c040',
        transform: [{ rotate: '10deg' }, { translateY: -4 }],
    },
    beamRight: {
        backgroundColor: '#f0c040',
        transform: [{ rotate: '-10deg' }, { translateY: -4 }],
    },

    /* ── Box ── */
    boxWrapper: {
        marginTop: 12,
        width: BOX_SIZE + 20,
        height: BOX_SIZE + 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#f0c040',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 28,
        elevation: 12,
    },
    /* Corner bracket pieces */
    corner: {
        position: 'absolute',
        width: CORNER_SIZE,
        height: CORNER_SIZE,
        borderColor: '#f0c040',
        zIndex: 2,
    },
    cornerTL: {
        top: 4,
        left: 4,
        borderTopWidth: CORNER_W,
        borderLeftWidth: CORNER_W,
    },
    cornerTR: {
        top: 4,
        right: 4,
        borderTopWidth: CORNER_W,
        borderRightWidth: CORNER_W,
    },
    cornerBL: {
        bottom: 4,
        left: 4,
        borderBottomWidth: CORNER_W,
        borderLeftWidth: CORNER_W,
    },
    cornerBR: {
        bottom: 4,
        right: 4,
        borderBottomWidth: CORNER_W,
        borderRightWidth: CORNER_W,
    },
    box: {
        width: BOX_SIZE,
        height: BOX_SIZE,
        backgroundColor: '#1a2535',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(240,192,64,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        overflow: 'hidden',
    },
    scanLine: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: 'rgba(240,192,64,0.55)',
        shadowColor: '#f0c040',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 6,
    },
    boxIcon: {
        fontSize: 32,
    },
    boxLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#f0c040',
        letterSpacing: 1.5,
    },

    /* ── Status ── */
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 28,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#f0c040',
        shadowColor: '#f0c040',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#f0c040',
        letterSpacing: 3,
        opacity: 0.8,
    },
});
