import { createRoot, Root } from 'react-dom/client';
import App, { ProgressionAppProps } from './App';
import './index.css';

export type { ProgressionAppProps };

let progressionRoot: Root | null = null;
let currentProps: ProgressionAppProps = {};

export function mountProgressionView(
  container: HTMLElement,
  options: ProgressionAppProps = {}
): {
  render: (newOptions?: Partial<ProgressionAppProps>) => void;
  unmount: () => void;
} {
  currentProps = { ...options };

  if (!progressionRoot) {
    progressionRoot = createRoot(container);
  }

  progressionRoot.render(<App {...currentProps} />);

  return {
    render: (newOptions?: Partial<ProgressionAppProps>) => {
      if (newOptions) {
        currentProps = { ...currentProps, ...newOptions };
      }
      progressionRoot?.render(<App {...currentProps} />);
    },
    unmount: () => {
      if (progressionRoot) {
        progressionRoot.unmount();
        progressionRoot = null;
      }
    },
  };
}
