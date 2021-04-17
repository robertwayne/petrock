import argparse
from subprocess import run, DEVNULL
from typing import List


def run_and_check(string: str, args: str):
    print(string)

    if args:
        process = run(args, stdout=DEVNULL, shell=True)
        if process.returncode == 0:
            print('Complete! ✔️')
        else:
            raise Exception

def multi_run_and_check(commands: List[List[str]]):
    for command in commands:
        try:
            run_and_check(command[0], command[1])
        except Exception as e:
            print(e)
            break


def deploy():
    parser = argparse.ArgumentParser(description='Deploys a version of https://petrock.gg via blue-green releases.')
    parser.add_argument('-c', '--color', type=str, choices=['blue', 'green'], help='Deploy on the blue or green server.')
    args = parser.parse_args()
    
    multi_run_and_check([
        ['Fetching latest code...', 'git pull --ff-only'],
        ['Updating dependencies...', 'yarn'],
        ['Updating config files...', f'cp $HOME/test_home/petrock_configs/ecosystem.config.{args.color}.js $HOME/test_home/petrock/ecosystem.config.js'],
        ['Building client...', 'yarn build'],
        [f'Starting processes via pm2: [`web-server-{args.color}`, `service-runner-{args.color}`]...', None],
        ['Swapping nginx ports...', None],
        ['Deployment complete!', None]
    ])


if __name__ == '__main__':
    deploy()
