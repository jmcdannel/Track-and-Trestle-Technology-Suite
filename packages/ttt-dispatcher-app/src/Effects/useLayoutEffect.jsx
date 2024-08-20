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
      } else {
        publish(`@ttt/dispatcher/${layoutId}`, JSON.stringify({
          action: 'effects',
          payload: effect
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

  return {
    updateEffect: handleUpdateEffect,
    getEffectbyId
  }

}

export default useLayoutEffect