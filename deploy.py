import argparse
import sys
from subprocess import run, DEVNULL
from typing import List

CEND   = '\33[0m'
CBOLD  = '\33[1m'
CGREEN = '\33[32m'
CRED   = '\33[31m'

def run_and_check(string: str, args: str, show_complete: bool = True, verbose: bool = False) -> int:
    if string:
        print(string, end=' ')

    if args:
        err_to = DEVNULL if verbose is False else sys.stderr
        process = run(args, stdout=DEVNULL, stderr=err_to, shell=True)

        if process.returncode == 0:
            if string and show_complete:
                print(f'{CGREEN}Complete!{CEND}', end='\n')
        else:
            raise Exception(process.check_returncode().output)

    return 0

def multi_run_and_check(commands: List[List[str]], verbose: bool = False) -> int:
    for i, command in enumerate(commands):
        try:
            run_and_check(command[0], command[1], verbose=verbose)
        except Exception as e:
            print(f'{CRED}Error!{CEND}\n{e}')
            break

    else:   
        return 0


def deploy():
    parser = argparse.ArgumentParser(description='Deploys a version of https://petrock.gg via blue-green releases.')
    parser.add_argument('-c', '--color', type=str, choices=['blue', 'green'], help='Deploy on the blue or green server.')
    parser.add_argument('-v', '--verbose', action='store_true', help='Turn on verbose error logging. Useful for debugging.')
    args = parser.parse_args()
    color = args.color

    opposite_color = {
        'green': 'blue',
        'blue': 'green'
    }

    complete = multi_run_and_check([
        ['Fetching latest code...', 'git pull --ff-only'],
        ['Updating dependencies...', 'yarn'],
        ['Updating config files...', f'cp $HOME/petrock_configs/ecosystem.config.{color}.js $HOME/test_home/petrock/ecosystem.config.js'],
        ['Building client...', 'yarn build'],
        [f'Starting processes...', 'pm2 start'],
        ['Swapping nginx ports...', f'cp $HOME/petrock_configs/nginx.config.{color} /etc/nginx/sites-available/petrock.gg'],
        [None, 'systemctl restart nginx'],
        [None, f'pm2 stop service-runner-{opposite_color.get(color)} && pm2 stop web-server-{opposite_color.get(color)}'],
    ], verbose=args.verbose)
        
    if complete == 0:
        print(f'{CGREEN}{CBOLD}✨ Deployment complete! ✨{CEND}\n')
        run('pm2 status', shell=True)


if __name__ == '__main__':
    deploy()
