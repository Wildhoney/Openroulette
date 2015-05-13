import cb from '../../helpers/CrossBrowser';

export default class VideoLocal extends React.Component {

    /**
     * @constructor
     * @return {VideoLocal}
     */
    constructor() {
        super();
        this.state = { stream: null };
    }

    /**
     * @method componentDidMount
     * @return {void}
     */
    componentDidMount() {

        let mediaOptions = { video: true, audio: true },
            url          = window.URL || window.webkitURL;

        // Attempt to fetch the user's media stream for their webcam.
        cb.getUserMedia(mediaOptions, (stream) => {
            let streamSource = url ? url.createObjectURL(stream) : stream;
            this.setState({ stream: streamSource });
        }, () => {

            console.log('Error!');

        });

    }

    /**
     * @method render
     * @return {Object}
     */
    render() {
        return React.createElement('video', { src: this.state.stream, muted: 'muted', autoPlay: 'autoplay' });
    }

}