import { Component, type ReactNode } from "react";

// Évite qu'une erreur de rendu (DonutChart, WorkflowBar) ne casse toute la page.
export class ErrorBoundary extends Component<
  { fallback?: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? <p className="text-sm italic text-gray-500">Erreur d'affichage</p>
      );
    }
    return this.props.children;
  }
}
