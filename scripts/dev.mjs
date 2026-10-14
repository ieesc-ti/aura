import { spawn } from 'child_process';

const args = process.argv.slice(2);
const nextArgs = ['dev'];

let i = 0;
while (i < args.length) {
  const arg = args[i];
  if (arg === '--host') {
    nextArgs.push('-H');
    if (args[i + 1] && !args[i + 1].startsWith('-')) {
      nextArgs.push(args[i + 1]);
      i += 2;
      continue;
    } else {
      nextArgs.push('0.0.0.0');
      i += 1;
      continue;
    }
  } else if (arg.startsWith('--host=')) {
    nextArgs.push('-H', arg.split('=')[1]);
    i += 1;
    continue;
  } else if (arg === '--port' || arg === '-p') {
    nextArgs.push('-p');
    if (args[i + 1] && !args[i + 1].startsWith('-')) {
      nextArgs.push(args[i + 1]);
      i += 2;
      continue;
    } else {
      nextArgs.push('3000');
      i += 1;
      continue;
    }
  } else if (arg.startsWith('--port=')) {
    nextArgs.push('-p', arg.split('=')[1]);
    i += 1;
    continue;
  } else {
    nextArgs.push(arg);
    i += 1;
  }
}

// Ensure default port and hostname if not provided
if (!nextArgs.includes('-p') && !nextArgs.includes('--port')) {
  nextArgs.push('-p', '3000');
}
if (!nextArgs.includes('-H') && !nextArgs.includes('--hostname')) {
  nextArgs.push('-H', '0.0.0.0');
}

process.env.NEXT_IGNORE_INCORRECT_LOCKFILE = '1';

const child = spawn('npx', ['next', ...nextArgs], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NEXT_IGNORE_INCORRECT_LOCKFILE: '1',
  },
});

child.on('exit', (code, signal) => {
  process.exit(code ?? (signal ? 1 : 0));
});

process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
