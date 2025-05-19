# my_erpnext_addon setup
# Author:  Your Name/Company
# Licence: MIT

from setuptools import setup, find_packages
import os

# Function to read the version from version.txt
def get_version():
    # version.txt should be in the main package directory (my_erpnext_addon/my_erpnext_addon/version.txt)
    version_file = os.path.join(os.path.dirname(__file__), 'my_erpnext_addon', 'version.txt')
    try:
        with open(version_file, 'r') as f:
            return f.read().strip()
    except FileNotFoundError:
        print(f"Warning: version.txt not found at {version_file}. Defaulting to 0.0.1")
        return "0.0.1"

# Read requirements from requirements.txt
requirements_file = os.path.join(os.path.dirname(__file__), 'requirements.txt')
install_requires = []
if os.path.exists(requirements_file):
    with open(requirements_file, 'r') as f:
        install_requires = f.read().strip().split('\n')
        install_requires = [req for req in install_requires if req and not req.startswith('#')]

# Get the long description from the README file
readme_file = os.path.join(os.path.dirname(__file__), 'README.md')
long_description = ""
if os.path.exists(readme_file):
    with open(readme_file, "r", encoding="utf-8") as fh:
        long_description = fh.read()

setup(
    name='globish_erpnext_realtime_notification',
    version=get_version(),
    description='Addon for ERPNext to publish notification to client users in realtime.',
    long_description=long_description,
    long_description_content_type="text/markdown",
    author='Globish',
    author_email='joe.mecksavanh@gmail.com',
    # url='https://github.com/your-github-username/my_erpnext_addon_repo', # Optional
    packages=find_packages(exclude=["*.tests", "*.tests.*", "tests.*", "tests"]),
    zip_safe=False,
    include_package_data=True,
    install_requires=install_requires,
    python_requires='>=3.7',
    license='MIT',
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Framework :: Frappe",
        "Operating System :: OS Independent",
    ],
)