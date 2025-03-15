import { Component } from 'react';
import toast from 'react-hot-toast';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error:', error, errorInfo);
        toast.error('Something went wrong');
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="text-center py-8">
                    <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                        onClick={() => {
                            this.setState({ hasError: false });
                            window.location.reload();
                        }}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 