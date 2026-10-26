export const initialQuestions = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    topics: ["Arrays", "Hash Map"],
    companies: ["Google", "Amazon", "Meta", "Microsoft"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 72,
    description: "Given an integer array `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    examples: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
        explanation: "nums[0] + nums[1] == 9, so we return [0, 1]."
      },
      {
        input: "nums = [3, 2, 4], target = 6",
        output: "[1, 2]",
        explanation: "nums[1] + nums[2] == 6, so we return [1, 2]."
      },
      {
        input: "nums = [3, 3], target = 6",
        output: "[0, 1]",
        explanation: "nums[0] + nums[1] == 6, so we return [0, 1]."
      }
    ],
    testCases: [
      { id: 1, input: "[2, 7, 11, 15]\n9", expected: "[0, 1]" },
      { id: 2, input: "[3, 2, 4]\n6", expected: "[1, 2]" },
      { id: 3, input: "[3, 3]\n6", expected: "[0, 1]" }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your solution here
        pass`,
      cpp: `#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};`,
      java: `import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}`
    },
    editorial: {
      intuition: "Instead of scanning all pairs (O(n²)), track complements in a hash map as you iterate once through the array.",
      bruteForce: "Nested loops checking every pair (i, j). Time: O(n²), Space: O(1).",
      optimalApproach: "Single pass hash table. As we examine each element x, compute complement = target - x. If complement exists in map, return indices. Otherwise store x -> current index.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      edgeCases: "Array with duplicate values that sum to target (e.g. [3, 3]), negative numbers, zero targets."
    }
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    topics: ["Strings", "Stack"],
    companies: ["Amazon", "Microsoft", "Meta", "Bloomberg"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 64,
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if open brackets are closed by the same type of brackets and in the correct order, and every close bracket has a corresponding open bracket of the same type.",
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    examples: [
      {
        input: 's = "()"',
        output: "true",
        explanation: "Simple matching pair."
      },
      {
        input: 's = "()[]{}"',
        output: "true",
        explanation: "All sequential brackets match their pairs."
      },
      {
        input: 's = "(]"',
        output: "false",
        explanation: "Opening round bracket does not match closing square bracket."
      }
    ],
    testCases: [
      { id: 1, input: '"()"', expected: "true" },
      { id: 2, input: '"()[]{}"', expected: "true" },
      { id: 3, input: '"(]"', expected: "false" }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        # Write your solution here
        pass`,
      cpp: `#include <string>
#include <stack>

class Solution {
public:
    bool isValid(std::string s) {
        // Write your solution here
        return false;
    }
};`,
      java: `import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        // Write your solution here
        return false;
    }
}`
    },
    editorial: {
      intuition: "Last opened bracket must be the first closed. This LIFO property maps directly to a stack data structure.",
      bruteForce: "Repeatedly find and replace substrings '()', '[]', '{}' until no changes occur. Time: O(n²).",
      optimalApproach: "Push opening brackets onto stack. When closing bracket is seen, check if stack is non-empty and top matches the corresponding opener. String is valid if stack is empty at end.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      edgeCases: "Odd length string (instant false), string starting with closing bracket, unclosed brackets remaining at end."
    }
  },
  {
    id: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    topics: ["Linked List", "Recursion"],
    companies: ["Amazon", "Apple", "Microsoft"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 68,
    description: "You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order."
    ],
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]",
        explanation: "Sorted elements merged preserving order."
      },
      {
        input: "list1 = [], list2 = []",
        output: "[]",
        explanation: "Empty lists return null."
      }
    ],
    testCases: [
      { id: 1, input: "[1,2,4]\n[1,3,4]", expected: "[1,1,2,3,4,4]" },
      { id: 2, input: "[]\n[]", expected: "[]" }
    ],
    starterCode: {
      javascript: `/**
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
function mergeTwoLists(list1, list2) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def mergeTwoLists(self, list1, list2):
        # Write your solution here
        pass`,
      cpp: `class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        // Write your solution here
        return nullptr;
    }
};`,
      java: `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Write your solution here
        return null;
    }
}`
    },
    editorial: {
      intuition: "Maintain a dummy head node. Compare current nodes of both lists and advance the pointer with smaller value.",
      bruteForce: "Extract all values into an array, sort the array, and reconstruct a new linked list. Time: O(n log n), Space: O(n).",
      optimalApproach: "Use a dummy head pointer and iterate while both lists have nodes. Append the smaller node to tail and advance that list's pointer. Finally, attach remaining non-null list.",
      timeComplexity: "O(n + m)",
      spaceComplexity: "O(1)",
      edgeCases: "One or both lists are null, lists of unequal lengths, duplicate values."
    }
  },
  {
    id: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    topics: ["Arrays", "Dynamic Programming"],
    companies: ["Amazon", "Meta", "Google", "Adobe"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 75,
    description: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve. If you cannot achieve any profit, return 0.",
    constraints: [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5."
      },
      {
        input: "prices = [7,6,4,3,1]",
        output: "0",
        explanation: "In this case, no transactions are done and the max profit = 0."
      }
    ],
    testCases: [
      { id: 1, input: "[7,1,5,3,6,4]", expected: "5" },
      { id: 2, input: "[7,6,4,3,1]", expected: "0" }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit(prices) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        # Write your solution here
        pass`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int maxProfit(std::vector<int>& prices) {
        // Write your solution here
        return 0;
    }
};`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        // Write your solution here
        return 0;
    }
}`
    },
    editorial: {
      intuition: "Track the minimum price seen so far while computing potential profit at each day.",
      bruteForce: "Check all pairs (i, j) with i < j. Time: O(n²).",
      optimalApproach: "Keep `minPrice` variable initialized to Infinity and `maxProfit` to 0. Traverse once: update minPrice, and update maxProfit with max(maxProfit, currentPrice - minPrice).",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      edgeCases: "Strictly decreasing prices (returns 0), single-day array (returns 0), identical prices."
    }
  },
  {
    id: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topics: ["Strings", "Sliding Window", "Hash Map"],
    companies: ["Google", "Amazon", "Meta", "Bloomberg", "Uber"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 51,
    description: "Given a string `s`, find the length of the longest substring without duplicate characters.",
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: "3",
        explanation: 'The answer is "wke", with the length of 3.'
      }
    ],
    testCases: [
      { id: 1, input: '"abcabcbb"', expected: "3" },
      { id: 2, input: '"bbbbb"', expected: "1" },
      { id: 3, input: '"pwwkew"', expected: "3" }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Write your solution here
        pass`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>

class Solution {
public:
    int lengthOfLongestSubstring(std::string s) {
        // Write your solution here
        return 0;
    }
};`,
      java: `import java.util.HashMap;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your solution here
        return 0;
    }
}`
    },
    editorial: {
      intuition: "Use two pointers defining a sliding window. Store the last seen index of each character to skip repeated characters instantly.",
      bruteForce: "Generate all substrings and test for unique characters with a set. Time: O(n³).",
      optimalApproach: "Maintain window [left, right]. Store `charIndexMap[char] = right`. When character at right is found at prevIndex >= left, advance left to prevIndex + 1. Update max length at each step.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(min(n, m)) where m is size of alphabet",
      edgeCases: "Empty string, string with all unique characters, string with single repeating character."
    }
  },
  {
    id: "3sum",
    title: "3Sum",
    difficulty: "Medium",
    topics: ["Arrays", "Two Pointers", "Sorting"],
    companies: ["Meta", "Amazon", "Apple", "Google"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 42,
    description: "Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.",
    constraints: [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5"
    ],
    examples: [
      {
        input: "nums = [-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]",
        explanation: "Distinct triplets summing to 0."
      },
      {
        input: "nums = [0,1,1]",
        output: "[]",
        explanation: "No triplet sums to 0."
      }
    ],
    testCases: [
      { id: 1, input: "[-1,0,1,2,-1,-4]", expected: "[[-1,-1,2],[-1,0,1]]" },
      { id: 2, input: "[0,1,1]", expected: "[]" }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        # Write your solution here
        pass`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    std::vector<std::vector<int>> threeSum(std::vector<int>& nums) {
        // Write your solution here
        return {};
    }
};`,
      java: `import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // Write your solution here
        return new ArrayList<>();
    }
}`
    },
    editorial: {
      intuition: "Sort array first. Fix one element `nums[i]`, then use two pointers (`left` and `right`) to find pairs that sum to `-nums[i]`.",
      bruteForce: "Three nested loops with a set to eliminate duplicate triplets. Time: O(n³).",
      optimalApproach: "Sort nums in ascending order. Loop i from 0 to n-3. Skip duplicates of nums[i]. Set left = i + 1, right = n - 1. While left < right, if sum == 0 add to result, then advance both pointers skipping identical numbers.",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(log n) to O(n) depending on sort implementation",
      edgeCases: "Array with all zeros `[0,0,0,0]`, array with no valid triplets, large negative/positive values."
    }
  },
  {
    id: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    topics: ["Arrays", "Two Pointers", "Greedy"],
    companies: ["Amazon", "Google", "Adobe", "Meta"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 59,
    description: "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
    constraints: [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4"
    ],
    examples: [
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation: "Max area between index 1 (height 8) and index 8 (height 7) is 7 * (8 - 1) = 49."
      }
    ],
    testCases: [
      { id: 1, input: "[1,8,6,2,5,4,8,3,7]", expected: "49" },
      { id: 2, input: "[1,1]", expected: "1" }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function maxArea(height) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def maxArea(self, height: list[int]) -> int:
        # Write your solution here
        pass`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int maxArea(std::vector<int>& height) {
        // Write your solution here
        return 0;
    }
};`,
      java: `class Solution {
    public int maxArea(int[] height) {
        // Write your solution here
        return 0;
    }
}`
    },
    editorial: {
      intuition: "Width shrinks as pointers converge. To maximize area = min(h[l], h[r]) * (r - l), always move the pointer pointing to the shorter vertical line.",
      bruteForce: "Evaluate area for all pairs of lines. Time: O(n²).",
      optimalApproach: "Initialize left = 0, right = n - 1. Calculate area and update max. Move whichever pointer has the smaller height inward. Repeat until pointers meet.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      edgeCases: "Array with identical heights, two elements only, strictly increasing heights."
    }
  },
  {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    topics: ["Arrays", "Two Pointers", "Dynamic Programming", "Stack"],
    companies: ["Google", "Amazon", "Microsoft", "Meta"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 38,
    description: "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    constraints: [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5"
    ],
    examples: [
      {
        input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        output: "6",
        explanation: "The elevation map traps 6 units of rain water."
      },
      {
        input: "height = [4,2,0,3,2,5]",
        output: "9",
        explanation: "Elevation traps 9 total units."
      }
    ],
    testCases: [
      { id: 1, input: "[0,1,0,2,1,0,1,3,2,1,2,1]", expected: "6" },
      { id: 2, input: "[4,2,0,3,2,5]", expected: "9" }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function trap(height) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def trap(self, height: list[int]) -> int:
        # Write your solution here
        pass`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int trap(std::vector<int>& height) {
        // Write your solution here
        return 0;
    }
};`,
      java: `class Solution {
    public int trap(int[] height) {
        // Write your solution here
        return 0;
    }
}`
    },
    editorial: {
      intuition: "Water above bar i is bounded by min(max_left[i], max_right[i]) - height[i]. Using two pointers from left and right reduces space to O(1).",
      bruteForce: "For each element, scan left and right to find max heights. Time: O(n²).",
      optimalApproach: "Use two pointers left = 0, right = n-1 and maintain leftMax and rightMax. Advance the pointer with smaller max boundary and accumulate water.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      edgeCases: "Array with less than 3 bars (traps 0), strictly descending or ascending bars."
    }
  },
  {
    id: "invert-binary-tree",
    title: "Invert Binary Tree",
    difficulty: "Easy",
    topics: ["Tree", "Depth-First Search", "Breadth-First Search"],
    companies: ["Google", "Amazon", "Netflix", "Apple"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 88,
    description: "Given the `root` of a binary tree, invert the tree, and return its root.",
    constraints: [
      "The number of nodes in the tree is in the range [0, 100].",
      "-100 <= Node.val <= 100"
    ],
    examples: [
      {
        input: "root = [4,2,7,1,3,6,9]",
        output: "[4,7,2,9,6,3,1]",
        explanation: "Left and right subtrees are recursively swapped."
      },
      {
        input: "root = [2,1,3]",
        output: "[2,3,1]",
        explanation: "Leaf nodes 1 and 3 are swapped."
      }
    ],
    testCases: [
      { id: 1, input: "[4,2,7,1,3,6,9]", expected: "[4,7,2,9,6,3,1]" },
      { id: 2, input: "[2,1,3]", expected: "[2,3,1]" }
    ],
    starterCode: {
      javascript: `/**
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 * @param {TreeNode} root
 * @return {TreeNode}
 */
function invertTree(root) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def invertTree(self, root):
        # Write your solution here
        pass`,
      cpp: `class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        // Write your solution here
        return nullptr;
    }
};`,
      java: `class Solution {
    public TreeNode invertTree(TreeNode root) {
        // Write your solution here
        return null;
    }
}`
    },
    editorial: {
      intuition: "For every node, swap its left and right children, then recursively invert the left and right subtrees.",
      bruteForce: "N/A — Inversion requires visiting every node once.",
      optimalApproach: "If root is null, return null. Swap root.left and root.right. Call invertTree on left and right, then return root.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(h) call stack where h is tree height",
      edgeCases: "Null tree, single node tree, skewed (linked list-like) tree."
    }
  },
  {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    topics: ["Arrays", "Divide and Conquer", "Dynamic Programming"],
    companies: ["Microsoft", "Amazon", "Apple", "Adobe"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 67,
    description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6."
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "Single element array has max sum 1."
      }
    ],
    testCases: [
      { id: 1, input: "[-2,1,-3,4,-1,2,1,-5,4]", expected: "6" },
      { id: 2, input: "[1]", expected: "1" },
      { id: 3, input: "[5,4,-1,7,8]", expected: "23" }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        # Write your solution here
        pass`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int maxSubArray(std::vector<int>& nums) {
        // Write your solution here
        return 0;
    }
};`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Write your solution here
        return 0;
    }
}`
    },
    editorial: {
      intuition: "Kadane's Algorithm: at each position, decide whether to extend the previous subarray or start fresh from the current number.",
      bruteForce: "Compute sum for every possible slice (i, j). Time: O(n²).",
      optimalApproach: "currentSum = max(nums[i], currentSum + nums[i]); maxSum = max(maxSum, currentSum).",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      edgeCases: "Array with all negative numbers (returns largest negative value), single element array."
    }
  },
  {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    topics: ["Arrays", "Binary Search"],
    companies: ["Microsoft", "Google", "Amazon", "Uber"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 82,
    description: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order."
    ],
    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "9 exists in nums and its index is 4."
      },
      {
        input: "nums = [-1,0,3,5,9,12], target = 2",
        output: "-1",
        explanation: "2 does not exist in nums so return -1."
      }
    ],
    testCases: [
      { id: 1, input: "[-1,0,3,5,9,12]\n9", expected: "4" },
      { id: 2, input: "[-1,0,3,5,9,12]\n2", expected: "-1" }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        # Write your solution here
        pass`,
      cpp: `#include <vector>

class Solution {
public:
    int search(std::vector<int>& nums, int target) {
        // Write your solution here
        return -1;
    }
};`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Write your solution here
        return -1;
    }
}`
    },
    editorial: {
      intuition: "Halve the search space on each step by comparing target to the middle element of the sorted array.",
      bruteForce: "Linear scan from index 0 to n - 1. Time: O(n).",
      optimalApproach: "Initialize low = 0, high = n - 1. While low <= high, mid = low + (high - low) / 2. If nums[mid] == target return mid; if nums[mid] < target set low = mid + 1; else set high = mid - 1. Return -1 if not found.",
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1)",
      edgeCases: "Target smaller than first element, target larger than last element, single element matching or not matching."
    }
  },
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    topics: ["Dynamic Programming", "Math", "Memoization"],
    companies: ["Amazon", "Google", "Adobe", "Apple"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 78,
    description: "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    constraints: [
      "1 <= n <= 45"
    ],
    examples: [
      {
        input: "n = 2",
        output: "2",
        explanation: "1 step + 1 step, or 2 steps."
      },
      {
        input: "n = 3",
        output: "3",
        explanation: "1+1+1, 1+2, or 2+1."
      }
    ],
    testCases: [
      { id: 1, input: "2", expected: "2" },
      { id: 2, input: "3", expected: "3" },
      { id: 3, input: "5", expected: "8" }
    ],
    starterCode: {
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def climbStairs(self, n: int) -> int:
        # Write your solution here
        pass`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        // Write your solution here
        return 0;
    }
};`,
      java: `class Solution {
    public int climbStairs(int n) {
        // Write your solution here
        return 0;
    }
}`
    },
    editorial: {
      intuition: "To reach step n, you must arrive from step (n-1) with a 1-step or from step (n-2) with a 2-step. Thus ways(n) = ways(n-1) + ways(n-2), exactly the Fibonacci relation.",
      bruteForce: "Naive recursion fib(n-1) + fib(n-2). Time: O(2^n).",
      optimalApproach: "Use two variables (prev1 = 1, prev2 = 1) and iteratively compute up to n. Space is reduced to O(1).",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      edgeCases: "n = 1, n = 2."
    }
  },
  {
    id: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    topics: ["Arrays", "Dynamic Programming", "Breadth-First Search"],
    companies: ["Amazon", "Microsoft", "Meta", "Bloomberg"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 46,
    description: "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.\n\nYou may assume that you have an infinite number of each kind of coin.",
    constraints: [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4"
    ],
    examples: [
      {
        input: "coins = [1,2,5], amount = 11",
        output: "3",
        explanation: "11 = 5 + 5 + 1 (3 coins)."
      },
      {
        input: "coins = [2], amount = 3",
        output: "-1",
        explanation: "Cannot make amount 3 using only denomination 2."
      }
    ],
    testCases: [
      { id: 1, input: "[1,2,5]\n11", expected: "3" },
      { id: 2, input: "[2]\n3", expected: "-1" },
      { id: 3, input: "[1]\n0", expected: "0" }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
function coinChange(coins, amount) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        # Write your solution here
        pass`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int coinChange(std::vector<int>& coins, int amount) {
        // Write your solution here
        return -1;
    }
};`,
      java: `import java.util.Arrays;

class Solution {
    public int coinChange(int[] coins, int amount) {
        // Write your solution here
        return -1;
    }
}`
    },
    editorial: {
      intuition: "Bottom-up dynamic programming: compute minimum coins needed for each intermediate amount from 1 up to target amount.",
      bruteForce: "Exhaustive recursive branch checking every coin choice. Time: O(len(coins)^amount).",
      optimalApproach: "Initialize dp array of size amount + 1 with amount + 1. dp[0] = 0. For i from 1 to amount: for each coin c in coins: if i - c >= 0, dp[i] = min(dp[i], dp[i-c] + 1). Return dp[amount] > amount ? -1 : dp[amount].",
      timeComplexity: "O(amount * coins.length)",
      spaceComplexity: "O(amount)",
      edgeCases: "amount = 0 (returns 0), coins cannot form amount (returns -1), coin denomination larger than amount."
    }
  },
  {
    id: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    topics: ["Arrays", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"],
    companies: ["Amazon", "Google", "Microsoft", "Meta", "Bloomberg"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 58,
    description: "Given an `m x n` 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is '0' or '1'."
    ],
    examples: [
      {
        input: 'grid = [\n  ["1","1","1","1","0"],\n  ["1","1","0","1","0"],\n  ["1","1","0","0","0"],\n  ["0","0","0","0","0"]\n]',
        output: "1",
        explanation: "All connected '1's form a single landmass."
      },
      {
        input: 'grid = [\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n]',
        output: "3",
        explanation: "Three distinct islands separated by water."
      }
    ],
    testCases: [
      { id: 1, input: '[["1","1","0"],["0","1","0"],["0","0","1"]]', expected: "2" },
      { id: 2, input: '[["1","0"],["0","1"]]', expected: "2" }
    ],
    starterCode: {
      javascript: `/**
 * @param {character[][]} grid
 * @return {number}
 */
function numIslands(grid) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        # Write your solution here
        pass`,
      cpp: `#include <vector>

class Solution {
public:
    int numIslands(std::vector<std::vector<char>>& grid) {
        // Write your solution here
        return 0;
    }
};`,
      java: `class Solution {
    public int numIslands(char[][] grid) {
        // Write your solution here
        return 0;
    }
}`
    },
    editorial: {
      intuition: "Treat the grid as an undirected graph. Each connected component of '1's is an island.",
      bruteForce: "N/A — graph traversal is standard.",
      optimalApproach: "Iterate over every cell. When a '1' is encountered, increment island count and run DFS/BFS to sink the entire island by marking visited cells as '0'.",
      timeComplexity: "O(m * n)",
      spaceComplexity: "O(m * n) worst case recursion stack",
      edgeCases: "All zeros, all ones, diagonal land (not considered connected)."
    }
  },
  {
    id: "kth-largest-element-in-an-array",
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    topics: ["Arrays", "Divide and Conquer", "Sorting", "Heap", "Quickselect"],
    companies: ["Meta", "Amazon", "Google", "Apple"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 66,
    description: "Given an integer array `nums` and an integer `k`, return the `k-th` largest element in the array.\n\nNote that it is the kth largest element in the sorted order, not the kth distinct element.\n\nCan you solve it without sorting in O(n) average time complexity?",
    constraints: [
      "1 <= k <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    examples: [
      {
        input: "nums = [3,2,1,5,6,4], k = 2",
        output: "5",
        explanation: "Sorted array is [1,2,3,4,5,6], 2nd largest is 5."
      },
      {
        input: "nums = [3,2,3,1,2,4,5,5,6], k = 4",
        output: "4",
        explanation: "Sorted array is [1,2,2,3,3,4,5,5,6], 4th largest is 4."
      }
    ],
    testCases: [
      { id: 1, input: "[3,2,1,5,6,4]\n2", expected: "5" },
      { id: 2, input: "[3,2,3,1,2,4,5,5,6]\n4", expected: "4" }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
function findKthLargest(nums, k) {
  // Write your solution here
  
}`,
      python: `import heapq

class Solution:
    def findKthLargest(self, nums: list[int], k: int) -> int:
        # Write your solution here
        pass`,
      cpp: `#include <vector>
#include <queue>

class Solution {
public:
    int findKthLargest(std::vector<int>& nums, int k) {
        // Write your solution here
        return 0;
    }
};`,
      java: `import java.util.PriorityQueue;

class Solution {
    public int findKthLargest(int[] nums, int k) {
        // Write your solution here
        return 0;
    }
}`
    },
    editorial: {
      intuition: "Maintain a min-heap of size k. After processing all elements, top of the heap is the k-th largest element.",
      bruteForce: "Sort array descending and return nums[k-1]. Time: O(n log n).",
      optimalApproach: "Quickselect (Hoare's selection algorithm) yields O(n) average time, or Min-Heap of size k yields O(n log k) guaranteed time and O(k) space.",
      timeComplexity: "O(n) average with quickselect, O(n log k) with min-heap",
      spaceComplexity: "O(k) with min-heap, O(1) with in-place quickselect",
      edgeCases: "k = 1 (maximum element), k = n (minimum element), array with all identical elements."
    }
  },
  {
    id: "lru-cache",
    title: "LRU Cache",
    difficulty: "Medium",
    topics: ["Hash Map", "Linked List", "Design", "Doubly-Linked List"],
    companies: ["Amazon", "Google", "Microsoft", "Meta", "Netflix", "Uber"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 43,
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class:\n- `LRUCache(int capacity)`: Initialize the LRU cache with positive size capacity.\n- `int get(int key)`: Return the value of the key if the key exists, otherwise return -1.\n- `void put(int key, int value)`: Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.\n\nThe functions get and put must each run in O(1) average time complexity.",
    constraints: [
      "1 <= capacity <= 3000",
      "0 <= key <= 10^4",
      "0 <= value <= 10^5",
      "At most 2 * 10^5 calls will be made to get and put."
    ],
    examples: [
      {
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: "[null, null, null, 1, null, -1, null, -1, 3, 4]",
        explanation: "Key 2 is evicted when key 3 is added because key 1 was accessed before."
      }
    ],
    testCases: [
      { id: 1, input: "capacity = 2, operations: put(1,1), put(2,2), get(1)", expected: "1" },
      { id: 2, input: "capacity = 1, operations: put(1,1), put(2,2), get(1)", expected: "-1" }
    ],
    starterCode: {
      javascript: `/**
 * @param {number} capacity
 */
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
  }

  get(key) {
    // Write your solution here
    return -1;
  }

  put(key, value) {
    // Write your solution here
  }
}`,
      python: `class LRUCache:
    def __init__(self, capacity: int):
        pass

    def get(self, key: int) -> int:
        return -1

    def put(self, key: int, value: int) -> None:
        pass`,
      cpp: `#include <unordered_map>
#include <list>

class LRUCache {
public:
    LRUCache(int capacity) {}
    int get(int key) { return -1; }
    void put(int key, int value) {}
};`,
      java: `import java.util.HashMap;

class LRUCache {
    public LRUCache(int capacity) {}
    public int get(int key) { return -1; }
    public void put(int key, int value) {}
}`
    },
    editorial: {
      intuition: "Combining a Hash Map with a Doubly Linked List gives O(1) lookups and O(1) removals/insertions at both ends.",
      bruteForce: "Array of items with timestamps. Eviction scans array for min timestamp. Time: O(n) for put/get.",
      optimalApproach: "Use a Doubly Linked List with dummy head and tail. Hash Map maps key -> Node pointer. Upon access, move node to head (most recent). Upon capacity breach, remove node right before tail (least recent).",
      timeComplexity: "O(1) for both get and put",
      spaceComplexity: "O(capacity)",
      edgeCases: "Capacity of 1, update existing key (does not increase count, only marks recent)."
    }
  },
  {
    id: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    topics: ["Arrays", "Sorting"],
    companies: ["Google", "Meta", "Amazon", "Microsoft", "Bloomberg"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 48,
    description: "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4"
    ],
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."
      },
      {
        input: "intervals = [[1,4],[4,5]]",
        output: "[[1,5]]",
        explanation: "Intervals [1,4] and [4,5] are considered overlapping."
      }
    ],
    testCases: [
      { id: 1, input: "[[1,3],[2,6],[8,10],[15,18]]", expected: "[[1,6],[8,10],[15,18]]" },
      { id: 2, input: "[[1,4],[4,5]]", expected: "[[1,5]]" }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
function merge(intervals) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        # Write your solution here
        pass`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    std::vector<std::vector<int>> merge(std::vector<std::vector<int>>& intervals) {
        // Write your solution here
        return {};
    }
};`,
      java: `import java.util.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        // Write your solution here
        return new int[][]{};
    }
}`
    },
    editorial: {
      intuition: "Sort intervals by start time. Any interval can only overlap with its predecessor in the sorted sequence.",
      bruteForce: "Build an adjacency graph of overlapping intervals and find connected components. Time: O(n²).",
      optimalApproach: "Sort intervals by start time. Iterate through sorted intervals: if the current start is <= previous end, merge by extending previous end to max(prev.end, current.end). Otherwise append as a new non-overlapping interval.",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(log n) or O(n) for sorting result",
      edgeCases: "Single interval, intervals touching at boundaries ([1,2] and [2,3]), completely nested intervals ([1,10] and [2,5])."
    }
  },
  {
    id: "word-break",
    title: "Word Break",
    difficulty: "Medium",
    topics: ["Hash Map", "Strings", "Dynamic Programming", "Trie", "Memoization"],
    companies: ["Amazon", "Meta", "Google", "Bloomberg"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 46,
    description: "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.\n\nNote that the same word in the dictionary may be reused multiple times in the segmentation.",
    constraints: [
      "1 <= s.length <= 300",
      "1 <= wordDict.length <= 1000",
      "1 <= wordDict[i].length <= 20",
      "s and wordDict[i] consist of only lowercase English letters.",
      "All the strings of wordDict are unique."
    ],
    examples: [
      {
        input: 's = "leetcode", wordDict = ["leet","code"]',
        output: "true",
        explanation: 'Return true because "leetcode" can be segmented as "leet code".'
      },
      {
        input: 's = "applepenapple", wordDict = ["apple","pen"]',
        output: "true",
        explanation: 'Return true because "applepenapple" can be segmented as "apple pen apple". Words can be reused.'
      }
    ],
    testCases: [
      { id: 1, input: '"leetcode"\n["leet","code"]', expected: "true" },
      { id: 2, input: '"catsandog"\n["cats","dog","sand","and","cat"]', expected: "false" }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
function wordBreak(s, wordDict) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def wordBreak(self, s: str, wordDict: list[str]) -> bool:
        # Write your solution here
        pass`,
      cpp: `#include <string>
#include <vector>
#include <unordered_set>

class Solution {
public:
    bool wordBreak(std::string s, std::vector<std::string>& wordDict) {
        // Write your solution here
        return false;
    }
};`,
      java: `import java.util.*;

class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        // Write your solution here
        return false;
    }
}`
    },
    editorial: {
      intuition: "Let `dp[i]` be true if prefix `s[0...i]` can be segmented. Then `dp[i]` is true if there exists `j < i` such that `dp[j]` is true and substring `s[j...i]` is in `wordDict`.",
      bruteForce: "Recursively test every prefix. Time: O(2^n).",
      optimalApproach: "Use boolean array `dp` of size `n + 1` with `dp[0] = true`. Convert wordDict to a Hash Set. For i from 1 to n: for j from 0 to i: if dp[j] and set.contains(s.slice(j, i)), then dp[i] = true, break.",
      timeComplexity: "O(n³)",
      spaceComplexity: "O(n + total wordDict characters)",
      edgeCases: "Single word match, words sharing common prefixes, impossible suffix."
    }
  },
  {
    id: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    topics: ["Arrays", "Binary Search", "Divide and Conquer"],
    companies: ["Google", "Amazon", "Microsoft", "Apple"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 37,
    description: "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).",
    constraints: [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m <= 1000",
      "0 <= n <= 1000",
      "1 <= m + n <= 2000",
      "-10^6 <= nums1[i], nums2[i] <= 10^6"
    ],
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.00000",
        explanation: "Merged array = [1,2,3] and median is 2."
      },
      {
        input: "nums1 = [1,2], nums2 = [3,4]",
        output: "2.50000",
        explanation: "Merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5."
      }
    ],
    testCases: [
      { id: 1, input: "[1,3]\n[2]", expected: "2.0" },
      { id: 2, input: "[1,2]\n[3,4]", expected: "2.5" }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
function findMedianSortedArrays(nums1, nums2) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:
        # Write your solution here
        pass`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    double findMedianSortedArrays(std::vector<int>& nums1, std::vector<int>& nums2) {
        // Write your solution here
        return 0.0;
    }
};`,
      java: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Write your solution here
        return 0.0;
    }
}`
    },
    editorial: {
      intuition: "Partition both arrays such that the combined left half contains half the total elements and every element in the left half is <= every element in the right half.",
      bruteForce: "Merge both arrays using two pointers and take middle. Time: O(m + n).",
      optimalApproach: "Binary search on the smaller array for the partition line. Check cross conditions: maxLeft1 <= minRight2 and maxLeft2 <= minRight1. If true, median is found.",
      timeComplexity: "O(log(min(m, n)))",
      spaceComplexity: "O(1)",
      edgeCases: "One array is empty, all elements of one array are smaller than the other."
    }
  },
  {
    id: "validate-binary-search-tree",
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    topics: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"],
    companies: ["Amazon", "Meta", "Bloomberg", "Adobe"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 52,
    description: "Given the `root` of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST is defined as follows:\n- The left subtree of a node contains only nodes with keys strictly less than the node's key.\n- The right subtree of a node contains only nodes with keys strictly greater than the node's key.\n- Both the left and right subtrees must also be binary search trees.",
    constraints: [
      "The number of nodes in the tree is in the range [1, 10^4].",
      "-2^31 <= Node.val <= 2^31 - 1"
    ],
    examples: [
      {
        input: "root = [2,1,3]",
        output: "true",
        explanation: "1 < 2 < 3, tree satisfies BST invariant."
      },
      {
        input: "root = [5,1,4,null,null,3,6]",
        output: "false",
        explanation: "Root's value is 5, but its right child's value is 4."
      }
    ],
    testCases: [
      { id: 1, input: "[2,1,3]", expected: "true" },
      { id: 2, input: "[5,1,4,null,null,3,6]", expected: "false" }
    ],
    starterCode: {
      javascript: `/**
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 * @param {TreeNode} root
 * @return {boolean}
 */
function isValidBST(root) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def isValidBST(self, root) -> bool:
        # Write your solution here
        pass`,
      cpp: `class Solution {
public:
    bool isValidBST(TreeNode* root) {
        // Write your solution here
        return false;
    }
};`,
      java: `class Solution {
    public boolean isValidBST(TreeNode root) {
        // Write your solution here
        return false;
    }
}`
    },
    editorial: {
      intuition: "Pass down valid lower and upper bounds `(low, high)` through recursion. Each node value must satisfy `low < node.val < high`.",
      bruteForce: "For each node, check if all nodes in left subtree are smaller and right subtree are larger. Time: O(n²).",
      optimalApproach: "Recursive validation `validate(node, minVal, maxVal)`. If node is null return true. If `node.val <= minVal` or `node.val >= maxVal` return false. Recursively check `validate(node.left, minVal, node.val)` and `validate(node.right, node.val, maxVal)`.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(h) call stack",
      edgeCases: "Node values equal to 32-bit INT_MIN or INT_MAX, duplicate values in tree (invalid in strict BST)."
    }
  },
  {
    id: "course-schedule",
    title: "Course Schedule",
    difficulty: "Medium",
    topics: ["Depth-First Search", "Breadth-First Search", "Graph", "Topological Sort"],
    companies: ["Google", "Amazon", "Meta", "Uber"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 46,
    description: "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [a_i, b_i]` indicates that you must take course `b_i` first if you want to take course `a_i`.\n\nReturn `true` if you can finish all courses. Otherwise, return `false`.",
    constraints: [
      "1 <= numCourses <= 2000",
      "0 <= prerequisites.length <= 5000",
      "prerequisites[i].length == 2",
      "0 <= a_i, b_i < numCourses",
      "All the pairs prerequisites[i] are unique."
    ],
    examples: [
      {
        input: "numCourses = 2, prerequisites = [[1,0]]",
        output: "true",
        explanation: "Take course 0 then take course 1."
      },
      {
        input: "numCourses = 2, prerequisites = [[1,0],[0,1]]",
        output: "false",
        explanation: "Cycle detected: 1 depends on 0 and 0 depends on 1."
      }
    ],
    testCases: [
      { id: 1, input: "2\n[[1,0]]", expected: "true" },
      { id: 2, input: "2\n[[1,0],[0,1]]", expected: "false" }
    ],
    starterCode: {
      javascript: `/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
function canFinish(numCourses, prerequisites) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:
        # Write your solution here
        pass`,
      cpp: `#include <vector>
#include <queue>

class Solution {
public:
    bool canFinish(int numCourses, std::vector<std::vector<int>>& prerequisites) {
        // Write your solution here
        return false;
    }
};`,
      java: `import java.util.*;

class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        // Write your solution here
        return false;
    }
}`
    },
    editorial: {
      intuition: "This problem asks whether the directed graph of prerequisites contains a cycle (directed acyclic graph check).",
      bruteForce: "Test all permutations of course sequences. Time: O(n!).",
      optimalApproach: "Kahn's Algorithm (BFS topological sort using in-degree array) or DFS with 3-color node state (unvisited, visiting, visited). If BFS processes numCourses elements, return true.",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V + E)",
      edgeCases: "Empty prerequisites (always true), disconnected components with cycles."
    }
  },
  {
    id: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    topics: ["Arrays", "Binary Search"],
    companies: ["Microsoft", "Amazon", "Meta", "Google"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 40,
    description: "There is an integer array `nums` sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, `nums` is possibly rotated at an unknown pivot index `k` (`1 <= k < nums.length`).\n\nGiven the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    constraints: [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values of nums are unique.",
      "nums is an ascending array that is possibly rotated."
    ],
    examples: [
      {
        input: "nums = [4,5,6,7,0,1,2], target = 0",
        output: "4",
        explanation: "0 is at index 4."
      },
      {
        input: "nums = [4,5,6,7,0,1,2], target = 3",
        output: "-1",
        explanation: "3 is not present in the array."
      }
    ],
    testCases: [
      { id: 1, input: "[4,5,6,7,0,1,2]\n0", expected: "4" },
      { id: 2, input: "[4,5,6,7,0,1,2]\n3", expected: "-1" }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        # Write your solution here
        pass`,
      cpp: `#include <vector>

class Solution {
public:
    int search(std::vector<int>& nums, int target) {
        // Write your solution here
        return -1;
    }
};`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Write your solution here
        return -1;
    }
}`
    },
    editorial: {
      intuition: "In any rotated sorted array, splitting at midpoint always yields at least one half that is strictly sorted.",
      bruteForce: "Linear scan through the array. Time: O(n).",
      optimalApproach: "Compute mid. If nums[mid] == target, return mid. If left half [low...mid] is sorted: if target lies within [nums[low], nums[mid]], search left (high = mid - 1); else search right (low = mid + 1). Else right half is sorted: if target lies within [nums[mid], nums[high]], search right; else search left.",
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1)",
      edgeCases: "Array not rotated at all, 2-element array, target at boundary."
    }
  },
  {
    id: "subsets",
    title: "Subsets",
    difficulty: "Medium",
    topics: ["Arrays", "Backtracking", "Bit Manipulation"],
    companies: ["Meta", "Amazon", "Bloomberg", "Google"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 77,
    description: "Given an integer array `nums` of unique elements, return all possible subsets (the power set).\n\nThe solution set must not contain duplicate subsets. Return the solution in any order.",
    constraints: [
      "1 <= nums.length <= 10",
      "-10 <= nums[i] <= 10",
      "All the numbers of nums are unique."
    ],
    examples: [
      {
        input: "nums = [1,2,3]",
        output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
        explanation: "All 2^3 = 8 subsets."
      },
      {
        input: "nums = [0]",
        output: "[[],[0]]",
        explanation: "Two subsets."
      }
    ],
    testCases: [
      { id: 1, input: "[1,2,3]", expected: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" },
      { id: 2, input: "[0]", expected: "[[],[0]]" }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function subsets(nums) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        # Write your solution here
        pass`,
      cpp: `#include <vector>

class Solution {
public:
    std::vector<std::vector<int>> subsets(std::vector<int>& nums) {
        // Write your solution here
        return {};
    }
};`,
      java: `import java.util.*;

class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        // Write your solution here
        return new ArrayList<>();
    }
}`
    },
    editorial: {
      intuition: "At each element, we have two choices: include the element or exclude it.",
      bruteForce: "Iteratively expand existing subsets by copying each subset and appending the next number.",
      optimalApproach: "Use backtracking `backtrack(start, currentList)`. Push a copy of currentList to result. For i from start to n-1: currentList.push(nums[i]), backtrack(i + 1, currentList), currentList.pop().",
      timeComplexity: "O(n * 2^n)",
      spaceComplexity: "O(n) recursion depth",
      edgeCases: "Single element array, negative numbers."
    }
  },
  {
    id: "implement-trie-prefix-tree",
    title: "Implement Trie (Prefix Tree)",
    difficulty: "Medium",
    topics: ["Hash Map", "Strings", "Design", "Trie"],
    companies: ["Google", "Amazon", "Microsoft", "Uber"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 64,
    description: "A trie (pronounced as 'try') or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker.\n\nImplement the `Trie` class:\n- `Trie()`: Initializes the trie object.\n- `void insert(String word)`: Inserts the string `word` into the trie.\n- `boolean search(String word)`: Returns `true` if the string `word` is in the trie (i.e., was inserted before), and `false` otherwise.\n- `boolean startsWith(String prefix)`: Returns `true` if there is a previously inserted string `word` that has the prefix `prefix`, and `false` otherwise.",
    constraints: [
      "1 <= word.length, prefix.length <= 2000",
      "word and prefix consist only of lowercase English letters.",
      "At most 3 * 10^4 calls in total will be made to insert, search, and startsWith."
    ],
    examples: [
      {
        input: '["Trie", "insert", "search", "search", "startsWith", "insert", "search"]\n[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]',
        output: "[null, null, true, false, true, null, true]",
        explanation: 'After inserting "apple", search "apple" is true, "app" is false. startsWith "app" is true. After inserting "app", search "app" becomes true.'
      }
    ],
    testCases: [
      { id: 1, input: 'insert("apple"), search("apple"), search("app")', expected: "[true, false]" },
      { id: 2, input: 'insert("app"), startsWith("ap")', expected: "true" }
    ],
    starterCode: {
      javascript: `class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    // Write your solution here
  }

  search(word) {
    // Write your solution here
    return false;
  }

  startsWith(prefix) {
    // Write your solution here
    return false;
  }
}`,
      python: `class Trie:
    def __init__(self):
        pass

    def insert(self, word: str) -> None:
        pass

    def search(self, word: str) -> bool:
        return False

    def startsWith(self, prefix: str) -> bool:
        return False`,
      cpp: `class Trie {
public:
    Trie() {}
    void insert(std::string word) {}
    bool search(std::string word) { return false; }
    bool startsWith(std::string prefix) { return false; }
};`,
      java: `class Trie {
    public Trie() {}
    public void insert(String word) {}
    public boolean search(String word) { return false; }
    public boolean startsWith(String prefix) { return false; }
}`
    },
    editorial: {
      intuition: "Each node represents a character transition and contains an array/hash of child nodes and a boolean flag `isEnd`.",
      bruteForce: "Store words in an array and linear scan with substring matches. Time: O(N * L).",
      optimalApproach: "Traverse tree character by character. For insert: create missing nodes, mark last as isEnd. For search: return true if full path exists and node is marked isEnd. For startsWith: return true if prefix path exists.",
      timeComplexity: "O(L) per operation where L is length of word/prefix",
      spaceComplexity: "O(total characters inserted)",
      edgeCases: "Search for word that is prefix of existing word, inserting duplicate words."
    }
  },
  {
    id: "edit-distance",
    title: "Edit Distance",
    difficulty: "Hard",
    topics: ["Strings", "Dynamic Programming"],
    companies: ["Google", "Amazon", "Microsoft"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 56,
    description: "Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`.\n\nYou have the following three operations permitted on a word:\n- Insert a character\n- Delete a character\n- Replace a character",
    constraints: [
      "0 <= word1.length, word2.length <= 500",
      "word1 and word2 consist of lowercase English letters."
    ],
    examples: [
      {
        input: 'word1 = "horse", word2 = "ros"',
        output: "3",
        explanation: 'horse -> rorse (replace "h" with "r") -> rose (remove "r") -> ros (remove "e")'
      },
      {
        input: 'word1 = "intention", word2 = "execution"',
        output: "5",
        explanation: "5 minimum operations required."
      }
    ],
    testCases: [
      { id: 1, input: '"horse"\n"ros"', expected: "3" },
      { id: 2, input: '"intention"\n"execution"', expected: "5" }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
function minDistance(word1, word2) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        # Write your solution here
        pass`,
      cpp: `#include <string>
#include <vector>
#include <algorithm>

class Solution {
public:
    int minDistance(std::string word1, std::string word2) {
        // Write your solution here
        return 0;
    }
};`,
      java: `class Solution {
    public int minDistance(String word1, String word2) {
        // Write your solution here
        return 0;
    }
}`
    },
    editorial: {
      intuition: "Classic Levenshtein distance 2D dynamic programming. `dp[i][j]` represents minimum operations to convert `word1[0...i-1]` to `word2[0...j-1]`.",
      bruteForce: "Recursive branching checking 3 operations at each mismatch. Time: O(3^(m+n)).",
      optimalApproach: "If `word1[i-1] == word2[j-1]`, then `dp[i][j] = dp[i-1][j-1]`. Otherwise, `1 + min(insert: dp[i][j-1], delete: dp[i-1][j], replace: dp[i-1][j-1])`.",
      timeComplexity: "O(m * n)",
      spaceComplexity: "O(m * n), can be optimized to O(min(m, n))",
      edgeCases: "Either word is empty (distance is length of other word), identical words (distance 0)."
    }
  },
  {
    id: "longest-palindromic-substring",
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    topics: ["Strings", "Dynamic Programming", "Two Pointers"],
    companies: ["Amazon", "Microsoft", "Meta", "Adobe"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 33,
    description: "Given a string `s`, return the longest palindromic substring in `s`.",
    constraints: [
      "1 <= s.length <= 1000",
      "s consist of only digits and English letters."
    ],
    examples: [
      {
        input: 's = "babad"',
        output: '"bab"',
        explanation: '"aba" is also a valid answer.'
      },
      {
        input: 's = "cbbd"',
        output: '"bb"',
        explanation: 'Length 2 palindrome "bb".'
      }
    ],
    testCases: [
      { id: 1, input: '"babad"', expected: '"bab"' },
      { id: 2, input: '"cbbd"', expected: '"bb"' }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {string}
 */
function longestPalindrome(s) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def longestPalindrome(self, s: str) -> str:
        # Write your solution here
        pass`,
      cpp: `#include <string>

class Solution {
public:
    std::string longestPalindrome(std::string s) {
        // Write your solution here
        return "";
    }
};`,
      java: `class Solution {
    public String longestPalindrome(String s) {
        // Write your solution here
        return "";
    }
}`
    },
    editorial: {
      intuition: "A palindrome mirrors around its center. There are 2n - 1 potential centers (odd length and even length centers).",
      bruteForce: "Check all substrings of length n down to 1. Time: O(n³).",
      optimalApproach: "Expand around each center i (for odd palindromes: left = i, right = i) and between i and i+1 (for even: left = i, right = i+1). Track the max length and boundaries.",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      edgeCases: "Single character string, all identical characters, string with no palindromes longer than 1."
    }
  },
  {
    id: "binary-tree-level-order-traversal",
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    topics: ["Tree", "Breadth-First Search", "Binary Tree"],
    companies: ["Amazon", "Meta", "Bloomberg", "Google"],
    status: "Todo",
    bookmarked: false,
    acceptanceRate: 67,
    description: "Given the `root` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
    constraints: [
      "The number of nodes in the tree is in the range [0, 2000].",
      "-1000 <= Node.val <= 1000"
    ],
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]",
        explanation: "Level 0: [3], Level 1: [9,20], Level 2: [15,7]."
      }
    ],
    testCases: [
      { id: 1, input: "[3,9,20,null,null,15,7]", expected: "[[3],[9,20],[15,7]]" },
      { id: 2, input: "[]", expected: "[]" }
    ],
    starterCode: {
      javascript: `/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
function levelOrder(root) {
  // Write your solution here
  
}`,
      python: `class Solution:
    def levelOrder(self, root) -> list[list[int]]:
        # Write your solution here
        pass`,
      cpp: `class Solution {
public:
    std::vector<std::vector<int>> levelOrder(TreeNode* root) {
        // Write your solution here
        return {};
    }
};`,
      java: `class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        // Write your solution here
        return new ArrayList<>();
    }
}`
    },
    editorial: {
      intuition: "Queue-based Breadth-First Search. At each level, capture current queue size so you only process nodes belonging to that level.",
      bruteForce: "N/A — standard BFS queue algorithm.",
      optimalApproach: "If root is null return empty list. Push root to queue. While queue is not empty: levelSize = queue.length. Create levelArray, loop levelSize times: dequeue node, add val to levelArray, enqueue left and right children if present. Push levelArray to result.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      edgeCases: "Null root, skewed tree, perfectly balanced binary tree."
    }
  }
];
