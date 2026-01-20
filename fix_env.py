import os

def fix_env():
    env_path = '.env.local'
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        # Clean potential BOM or garbage
        content = content.replace('\ufeff', '')
        
        with open(env_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Successfully fixed {env_path} encoding to UTF-8")
    else:
        print(f"{env_path} not found")

if __name__ == "__main__":
    fix_env()
