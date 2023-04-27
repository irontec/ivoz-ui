import { Grid, LinearProgress } from '@mui/material';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  minimalist?: boolean;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (!this.props.minimalist) {
      return <h3>Sorry.. there was an error</h3>;
    }

    const size = {
      xs: 12,
      md: 6,
      lg: 4,
      xl: 3,
    };

    return (
      <Grid item {...size} sx={{ paddingTop: '50px!important' }} id='error'>
        <LinearProgress color={'error'} />
        &nbsp;
      </Grid>
    );
  }
}

export default ErrorBoundary;
