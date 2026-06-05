import { RotateCcw, AlertTriangle } from "lucide-react";
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Memperbarui state agar render berikutnya menampilkan UI fallback
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleReload = () => {
    // Reset state eror dan muat ulang halaman
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-bright flex flex-col items-center justify-center p-6 text-center">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 mb-4 animate-bounce">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white mb-2">
            Something wrong, please try again
          </h2>
          <p className="text-sm text-muted max-w-md mb-6 leading-relaxed">
            {this.state.error?.message || "Gagal memuat data dari server (Too Many Requests / Server Error)."}
          </p>
          <button
            onClick={this.handleReload}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-background font-black uppercase text-xs tracking-wider px-5 py-3 rounded-xl transition-all shadow-lg shadow-primary/20 group"
          >
            <RotateCcw size={14} className="group-hover:rotate-45 transition-transform" />
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

