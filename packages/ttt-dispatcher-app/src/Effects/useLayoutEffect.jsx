import { useEffectStore } from '../Store/useEffectStore';
import { useMqtt } from '../Core/Com/MqttProvider'
import { useDcc } from '../Dcc/useDcc'
import { useConnectionStore } from '../Store/useConnectionStore';

export function useLayoutEffect() {
  const { publish } = useMqtt();
  const { setOutput } = useDcc()

  const layoutId = useConnectionStore(state => state.layoutId);
  const effects = useEffectStore(state => state.effects)
  const updateEffect = useEffectStore(state => state.updateEffect)

  async function handleUpdateEffect(effect) {
    try {
      console.log('useLayoutEffect.handleEffect', effect);

      if (effect?.config?.interface === 'dcc-js-api') {
        handleDcc(effect);
      } else if (effect?.type === 'ialed') {
        await handleIALed(effect);
      } else if (effect?.type === 'macro') {
        await handleMacro(effect);
      } else if (effect?.type === 'signal') {
        publish(`@ttt/dispatcher/${layoutId}`, JSON.stringify({
          action: 'effects',
          payload: { 
            effectId: effect.effectId, 
            state: effect.state,
            type: effect.type
          }
        }))
      } else {
        publish(`@ttt/dispatcher/${layoutId}`, JSON.stringify({
          action: 'effects',
          payload: { 
            effectId: effect.effectId, 
            state: effect.state,
            type: effect.type
          }
        }))
      }
      await updateEffect(effect);

    } catch (error) {
      console.error('API.handleEffect', error, effect);
    }
  }

  function getEffectbyId(effectId) {
    return effects.find(e => e.effectId === effectId);
  }

  async function handleIALed(effect) {
    try {
      const action = {
        ...effect.config, 
        command: effect.state ? effect.config.command : 'off'
      }
      publish(`@ttt/ialed/${layoutId}`, JSON.stringify(action));
    } catch (err) {
      console.error('[IALED ERROR]', err?.message, JSON.stringify(effect));
    }
  }

  async function handleDcc(effect) {
    try {
      setOutput(effect.config.pin, effect.state);
    } catch (err) {
      console.error('[IALED ERROR]', err?.message, JSON.stringify(effect));
    }
  }

  const macroDelay = 3000
  function delay(t, data) {
    return new Promise(resolve => {
        setTimeout(resolve.bind(null, data), t);
    });
  }

// assume this is inside an async function    

  async function handleMacro(effect) {
    try {
      console.log('API.handleMacro', effect);

      for (let e of effect.config?.on) {
        const onEffect = await getEffectbyId(e);
        const onState = onEffect?.type !== 'signal'
          ? effect.state
          : effect.state ? 'green' : 'red';
        await handleUpdateEffect({...onEffect, state: onState}).then(delay.bind(null, macroDelay));
      }
      for (let e of effect.config?.off) {
        const offEffect = await getEffectbyId(e);
        const offState = offEffect?.type !== 'signal'
          ? !effect.state
          : !effect.state ? 'green' : 'red';
        await handleUpdateEffect({...offEffect, state: offState}).then(delay.bind(null, macroDelay));
      }
      // effect.config?.on.map(async e => 
      //   setTimeout(
      //     async () => await handleUpdateEffect({...getEffectbyId(e), state: effect.state}), 
      //     macroDelay
      //   )
      // );
      // effect.config?.off.map(async e => 
      //   setTimeout(
      //     async () => await handleUpdateEffect({...getEffectbyId(e), state: !effect.state}), 
      //     macroDelay
      //   )
      // );
    } catch (err) {
      console.error('[IALED ERROR]', err?.message, JSON.stringify(effect));
    }
  }

  return {
    updateEffect: handleUpdateEffect,
    getEffectbyId
  }

}

export default useLayoutEffect