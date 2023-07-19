import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../Store/Store';
import { usePrevious } from '../Shared/Hooks/usePrevious';
import jmriApi from '../Shared/jmri/jmriApi';

export const JmriThrottleController = props => {

    const { speed, forward, address } = props;
    const [ , dispatch ] = useContext(Context);
    const [ speedChange, setSpeedChange ] = useState(null);
    const [ changeDirection, setChangeDirection ] = useState(false);
    const prevSpeed = usePrevious(speed);
    const prevForward = usePrevious(forward);

    useEffect(() => {
        const handleSpeed = async ({ name, speed }) => {
            try {
                console.log('handleSpeed', { address: name, speed });
                await dispatch({ type: 'UPDATE_LOCO', payload: { address: name, speed } });
            } catch(err) {
                console.error(err);
            }
        };

        const handleDirection = async ({ name, forward }) => {
            try {
                console.log('handleDirection', { address: name, forward });
                await dispatch({ type: 'UPDATE_LOCO', payload: { address: name, forward } });
            } catch(err) {
                console.error(err);
            }
        };

        console.log('jmri handlers');
        jmriApi.on('direction', 'JmriThrottleController', handleDirection);
        jmriApi.on('speed', 'JmriThrottleController', handleSpeed);
    }, [dispatch]);

    useEffect(() => {
        if (prevForward !== forward) {
            setChangeDirection(true);
        }
    }, [forward, prevForward]);

    useEffect(() => {
        const updateDirection = async () => {
            try {
                console.log('changeDirection');
                await jmriApi.changeDirection(address, forward);
                console.log('/changeDirection');
            } catch (err) {
                console.error(err);
            } 
        }
        if (changeDirection) {
            updateDirection();
            setChangeDirection(false);
            setSpeedChange(true);
        }
    }, [changeDirection, address, forward]);

    useEffect(() => {
        if (prevSpeed !== speed) {
            setSpeedChange(true);
        }
    }, [speed, prevSpeed]);

    useEffect(() => {
        const updateThrottle = async () => {
            try {
                console.log('updateThrottle');
                await jmriApi.throttle(address, Math.abs(speed));
                console.log('/updateThrottle');
            } catch (err) {
                console.error(err);
            }
        }
        if (speedChange && !changeDirection) {
            updateThrottle();
            setSpeedChange(false);
        }
    }, [speedChange, address, speed, changeDirection]);

    return (<></>)
}

export default JmriThrottleController;
