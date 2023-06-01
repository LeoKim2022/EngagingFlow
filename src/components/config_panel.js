import './config_panel.css'

import {useGlobalConfig} from './context_global_config'

export default function ConfigPanel(props) {

    const [globalConfig, setGlobalConfig] = useGlobalConfig();

    function onChangeColor(event) {
        setGlobalConfig({
            lineColor: event.target.value
        });    
    }

    function onChangeOpacity(event) {
        setGlobalConfig({
            opacity: event.target.value
        });
    }
    
    return (
        <div 
            className="control-panel" 
        >
            <div className='control-panel-title' ><span>Flow Config</span></div>
            <div className='control-item'>
                <div><span>Line Color</span></div>
                <div><input type='color' value={globalConfig.lineColor} onChange={onChangeColor} /></div>
            </div>
            <div className='control-item'>
                <div><span>Opacity</span></div>
                <div>
                    <input 
                        type='range' 
                        min={0} 
                        max={1} 
                        color='gray' 
                        step={0.1} 
                        value={globalConfig.opacity} 
                        readOnly={false}
                        onChange={onChangeOpacity} />
                </div>
            </div>


        </div>
    );
}